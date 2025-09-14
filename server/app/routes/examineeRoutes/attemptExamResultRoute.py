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
        time_taken_minutes=time_taken
    )
    db.session.add(attempt_result)
    db.session.flush()  # get attempt_result_id

    # Save each question attempt
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

        attempt_question = ExamineeAttemptQuestions(
            attempt_result_id=attempt_result.attempt_result_id,
            original_question_id=uuid.UUID(q.get('question_id')),
            question_text=q.get('question_text'),
            question_image_url=q.get('question_image_url'),
            question_image_id=q.get('question_image_id'),

            option_a_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), None),
            option_a_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), None),
            option_a_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'A'), None),

            option_b_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), None),
            option_b_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), None),
            option_b_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'B'), None),

            option_c_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), None),
            option_c_image_url=next((opt.get('option_image_url') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), None),
            option_c_image_id=next((opt.get('option_image_id') for opt in q.get('options', []) if opt.get('option_letter') == 'C'), None),

            option_d_text=next((opt.get('option_text') for opt in q.get('options', []) if opt.get('option_letter') == 'D'), None),
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

    return jsonify({
        'status': 'success',
        'message': 'Exam attempt saved successfully',
        'attempt_result_id': str(attempt_result.attempt_result_id),
        'total_questions': attempt_result.total_questions,
        'score': attempt_result.score,
        'correct_answers': correct_count,
        'wrong_answers': wrong_count,
        'unanswered_questions': unanswered_count
    }), 200
