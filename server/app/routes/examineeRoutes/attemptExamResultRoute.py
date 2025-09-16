from flask import Blueprint, request, jsonify
from app.models import db, ExamineeAttemptExamResult, ExamineeAttemptQuestions
from app.routes.authRoutes.userRoutes import token_required
import uuid

examinee_attempt_exam_result_bp = Blueprint(
    'examinee_attempt_exam_result', __name__, url_prefix='/api/examinee'
)

@examinee_attempt_exam_result_bp.route('/attempt-exam-result', methods=['POST'])
@token_required
def examineeAttempExamResult(user):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    examinee_id = uuid.UUID(str(user.id))
    exam_id = data.get('exam_id')
    questions_payload = data.get('questions', [])  # Full questions + options from frontend
    time_taken = data.get('time_taken_minutes', 0)
    exam_name = data.get('exam_name')
    exam_code = data.get('exam_code')
    subject = data.get('subject')
    chapter = data.get('chapter')
    class_name = data.get('class_name')
    total_marks = data.get('total_marks')
    negative_marking_value = data.get('negative_marking_value')
    total_time_minutes = data.get('total_time_minutes')

    if not exam_id:
        return jsonify({'error': 'Exam ID is required'}), 400

    total_questions = len(questions_payload)
    correct_count = 0
    wrong_count = 0
    unanswered_count = 0

    # Create Exam Attempt Result
    attempt_result = ExamineeAttemptExamResult(
        examinee_id=examinee_id,
        exam_id=uuid.UUID(exam_id),
        score=0,
        total_questions=total_questions,
        correct_answers=0,
        wrong_answers=0,
        unanswered_questions=total_questions,
        negative_marking_value = negative_marking_value,
        time_taken_minutes=time_taken
    )
    db.session.add(attempt_result)
    db.session.flush()  # get attempt_result_id

    # Save each question attempt
    attempted_questions = []
    for q in questions_payload:
        selected_label = None
        # Determine user selected option
        for opt in q.get('options', []):
            if opt.get('selected_by_user'):
                selected_label = opt.get('option_letter')
                break

        is_correct = selected_label == q.get('correct_answer') if selected_label else False

        if selected_label is None:
            unanswered_count += 1
        elif is_correct:
            correct_count += 1
        else:
            wrong_count += 1

        # Prepare question data for response - ensure all fields are included
        question_data = {
            'question_id': q.get('question_id'),
            'question_text': q.get('question_text'),
            'question_image_url': q.get('question_image_url'),
            'question_image_id': q.get('question_image_id'),
            'marks': q.get('marks', 1),  # Include marks
            'correct_answer': q.get('correct_answer'),
            'selected_answer': selected_label,
            'is_correct': is_correct,
            'options': []
        }

        # Add options data - ensure all options are included even if empty
        options_data = []
        for opt in q.get('options', []):
            option_data = {
                'option_letter': opt.get('option_letter'),
                'option_text': opt.get('option_text'),
                'option_image_url': opt.get('option_image_url'),
                'option_image_id': opt.get('option_image_id'),
                'is_correct': opt.get('option_letter') == q.get('correct_answer'),
                'selected_by_user': opt.get('selected_by_user', False)
            }
            options_data.append(option_data)
        
        # Ensure we always have 4 options (A, B, C, D) even if some are missing
        for letter in ['A', 'B', 'C', 'D']:
            existing_option = next((opt for opt in options_data if opt['option_letter'] == letter), None)
            if not existing_option:
                options_data.append({
                    'option_letter': letter,
                    'option_text': '',
                    'option_image_url': None,
                    'option_image_id': None,
                    'is_correct': False,
                    'selected_by_user': False
                })
        
        # Sort options by letter (A, B, C, D)
        options_data.sort(key=lambda x: x['option_letter'])
        question_data['options'] = options_data
        
        attempted_questions.append(question_data)

        # Save to database
        attempt_question = ExamineeAttemptQuestions(
            attempt_result_id=attempt_result.attempt_result_id,
            original_question_id=uuid.UUID(q.get('question_id')),
            question_text=q.get('question_text'),
            question_image_url=q.get('question_image_url'),
            question_image_id=q.get('question_image_id'),

            option_a_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), ''),
            option_a_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), None),
            option_a_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), None),

            option_b_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), ''),
            option_b_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), None),
            option_b_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), None),

            option_c_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), ''),
            option_c_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), None),
            option_c_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), None),

            option_d_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'D'), ''),
            option_d_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'D'), None),
            option_d_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'D'), None),

            correct_option_label=q.get('correct_answer'),
            selected_option_label=selected_label,
            is_correct=is_correct,
        )
        db.session.add(attempt_question)

    # Update overall attempt result
    attempt_result.correct_answers = correct_count
    attempt_result.wrong_answers = wrong_count
    attempt_result.unanswered_questions = unanswered_count
    attempt_result.score = correct_count

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'status':'error', 'message': f'Database commit failed: {str(e)}'}), 500

    # Return comprehensive response that frontend can use directly
    return jsonify({
        'status': 'success',
        'message': 'Exam attempt saved successfully',
        'attempt_result': {
            'examinee_id': str(examinee_id),
            'exam_id': exam_id,
            'score': correct_count,
            'total_questions': total_questions,
            'correct_answers': correct_count,
            'wrong_answers': wrong_count,
            'unanswered_questions': unanswered_count,
            'negative_marking_value':negative_marking_value,

            'time_taken_minutes': time_taken,
            'created_at': attempt_result.created_at.isoformat() if attempt_result.created_at else None
        },
        'exam_details': {
            'exam_name': exam_name,
            'exam_code': exam_code,
            'subject': subject,
            'chapter': chapter,
            'class_name': class_name,
            'total_marks': total_marks,
            'total_time_minutes': total_time_minutes
        },
        'questions': attempted_questions
    }), 200



#atempt exam result leaderboard
@examinee_attempt_exam_result_bp.route('/exams/<exam_id>/leaderboard', methods=['GET'])
@token_required
def get_exam_leaderboard(user, exam_id):
    try:
        # Validate exam_id
        try:
            exam_uuid = uuid.UUID(exam_id)
        except ValueError:
            return jsonify({'error': 'Invalid exam ID format'}), 400

        # Get the exam details
        from app.models.examinerModels.createExamModels import Exam  # Import your Exam model
        exam = Exam.query.get(exam_uuid)
        if not exam:
            return jsonify({'error': 'Exam not found'}), 404

        # Get all attempt results for this exam, ordered by score descending
        attempts = ExamineeAttemptExamResult.query.filter_by(
            exam_id=exam_uuid
        ).order_by(
            ExamineeAttemptExamResult.score.desc(),
            ExamineeAttemptExamResult.time_taken_minutes.asc()
        ).all()

        leaderboard_data = []
        
        for rank, attempt in enumerate(attempts, 1):
            # Get examinee details
            from app.models.authModels.user import User  # Import your User model
            examinee = User.query.get(attempt.examinee_id)
            
            if examinee:
                leaderboard_data.append({
                    'attempt_id': str(attempt.attempt_result_id),
                    'rank': rank,
                    'examinee_id': str(examinee.id),
                    'name': examinee.name,
                    'score': attempt.score,  # This should be the percentage score
                    'correct_answers': attempt.correct_answers,
                    'wrong_answers': attempt.wrong_answers,
                    'unanswered_questions': attempt.unanswered_questions,
                    'time_taken_minutes': attempt.time_taken_minutes,
                    'exam_name': exam.exam_name,
                    'created_at': attempt.created_at.isoformat() if attempt.created_at else None
                })

        return jsonify({
            'status': 'success',
            'exam': {
                'exam_id': str(exam.id),
                'exam_name': exam.exam_name,
                'total_questions': exam.total_questions if hasattr(exam, 'total_questions') else None,
                'total_marks': exam.total_marks if hasattr(exam, 'total_marks') else None
            },
            'leaderboard': leaderboard_data
        }), 200

    except Exception as e:
        print(f"Error fetching leaderboard: {str(e)}")
        return jsonify({'error': 'Failed to fetch leaderboard data'}), 500