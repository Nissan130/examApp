from flask import Blueprint, request, jsonify
from app.models import db, ExaminerCreatedExam, ExamineeAttemptExams, ExamineeAttemptExamQuestions
import uuid
from app.utils.cloudinary_utils import upload_image
from app.routes.authRoutes.userRoutes import token_required
import json

examinee_previous_attempt_exam_bp = Blueprint("examinee_previous_attempt_exam", __name__, url_prefix="/api/examinee")


# -----------------------------
# Get all exams created by the logged-in user (without status/delete)
# -----------------------------
@examinee_previous_attempt_exam_bp.route('/previous-attempt-exam', methods=['GET'])
@token_required
def get_attempt_exams(user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        exams_query = ExamineeAttemptExams.query.filter_by(examinee_id=user.id)
        total_exams = exams_query.count()

        exams = exams_query.order_by(ExamineeAttemptExams.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        exams_list = []
        for exam in exams.items:
            exams_list.append({
                'attempt_exam_id': str(exam.attempt_exam_id),
                'exam_id': str(exam.exam_id),
                'exam_name': exam.exam_name,
                'subject': exam.subject,
                'class_name': exam.class_name,
                'chapter': exam.chapter,
                'total_marks': exam.total_marks,
                'total_time_minutes': exam.total_time_minutes,
                'negative_marks_value': exam.negative_marks_value,
                'examiner_name': exam.examiner_name,
                'score': exam.score,
                'total_questions': exam.total_questions,
                'correct_answers': exam.correct_answers,
                'wrong_answers': exam.wrong_answers,
                'unanswered_questions': exam.unanswered_questions,
                'time_taken_seconds': exam.time_taken_seconds,
                'created_at': exam.created_at.isoformat() if exam.created_at else None
            })

        return jsonify({
            'status': 'success',
            'exams': exams_list,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_pages': exams.pages,
                'total_exams': total_exams,
                'has_next': exams.has_next,
                'has_prev': exams.has_prev
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch exams',
            'details': str(e)
        }), 500


@examinee_previous_attempt_exam_bp.route('/previous-attempt-exam/<attemptExamId>', methods=['GET'])
@token_required
def get_attempt_exam(user, attemptExamId):
    try:
        # Find the specific exam attempt
        exam = ExamineeAttemptExams.query.filter_by(
            attempt_exam_id=attemptExamId,
            examinee_id=user.id  # Ensure the exam belongs to the current user
        ).first()
        
        if not exam:
            return jsonify({
                'status': 'error',
                'message': 'Exam attempt not found'
            }), 404

        # Get all questions for this exam attempt
        questions = ExamineeAttemptExamQuestions.query.filter_by(
            attempt_exam_id=attemptExamId
        ).order_by(ExamineeAttemptExamQuestions.created_at).all()

        exam_data = {
            'attempt_exam_id': str(exam.attempt_exam_id),
            'exam_id': str(exam.exam_id),
            'exam_name': exam.exam_name,
            'subject': exam.subject,
            'class_name': exam.class_name,
            'chapter': exam.chapter,
            'total_marks': exam.total_marks,
            'total_time_minutes': exam.total_time_minutes,
            'negative_marks_value': exam.negative_marks_value,
            'examiner_name': exam.examiner_name,
            'score': exam.score,
            'total_questions': exam.total_questions,
            'correct_answers': exam.correct_answers,
            'wrong_answers': exam.wrong_answers,
            'unanswered_questions': exam.unanswered_questions,
            'time_taken_seconds': exam.time_taken_seconds,
            'created_at': exam.created_at.isoformat() if exam.created_at else None,
            'questions': []
        }
        
        for question in questions:
            exam_data['questions'].append({
                'question_id': str(question.attempt_question_id),
                'original_question_id': str(question.original_question_id) if question.original_question_id else None,
                'question_text': question.question_text,
                'question_image_url': question.question_image_url,
                'question_image_id': question.question_image_id,
                'marks': 1,  # You might want to store marks per question in your model
                'question_order': None,  # You might want to add order field to your model
                'selected_answer': question.selected_option_label,
                'correct_answer': question.correct_option_label,
                'is_correct': question.is_correct,
                'options': {
                    'A': {
                        'text': question.option_a_text, 
                        'image_url': question.option_a_image_url, 
                        'image_id': question.option_a_image_id
                    },
                    'B': {
                        'text': question.option_b_text, 
                        'image_url': question.option_b_image_url, 
                        'image_id': question.option_b_image_id
                    },
                    'C': {
                        'text': question.option_c_text, 
                        'image_url': question.option_c_image_url, 
                        'image_id': question.option_c_image_id
                    },
                    'D': {
                        'text': question.option_d_text, 
                        'image_url': question.option_d_image_url, 
                        'image_id': question.option_d_image_id
                    }
                }
            })

        return jsonify({
            'status': 'success',
            'exam': exam_data
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch exam',
            'details': str(e)
        }), 500


# Attempt exam result leaderboard
@examinee_previous_attempt_exam_bp.route('/attempt-exam/<exam_id>/leaderboard', methods=['GET'])
@token_required
def get_exam_leaderboard(user, exam_id):
    try:
        # Validate exam_id
        try:
            exam_uuid = uuid.UUID(exam_id)
        except ValueError:
            return jsonify({'error': 'Invalid exam ID format'}), 400

        # Get all attempt results for this exam, ordered by score then time
        attempts = ExamineeAttemptExams.query.filter_by(
            exam_id=exam_uuid
        ).order_by(
            ExamineeAttemptExams.score.desc(),
            ExamineeAttemptExams.time_taken_seconds.asc()
        ).all()

        if not attempts:
            return jsonify({'error': 'No attempts found for this exam'}), 404

        leaderboard_data = []
        current_user_rank = None

        for rank, attempt in enumerate(attempts, 1):
            from app.models.authModels.user import User
            examinee = User.query.get(attempt.examinee_id)

            row = {
                'attempt_exam_id': str(attempt.attempt_exam_id),
                'rank': rank,
                'examinee_id': str(examinee.id) if examinee else None,
                'name': examinee.name if examinee else "Unknown",
                'score': attempt.score,
                'correct_answers': attempt.correct_answers,
                'wrong_answers': attempt.wrong_answers,
                'unanswered_questions': attempt.unanswered_questions,
                'time_taken_seconds': attempt.time_taken_seconds,
                'created_at': attempt.created_at.isoformat() if attempt.created_at else None
            }
            leaderboard_data.append(row)

            # Track current user's rank
            if attempt.examinee_id == user.id:
                current_user_rank = rank

        # Use the first attempt for exam snapshot
        exam_snapshot = attempts[0]

        return jsonify({
            'status': 'success',
            'exam': {
                'exam_id': str(exam_snapshot.exam_id),
                'exam_name': exam_snapshot.exam_name,
                'subject': exam_snapshot.subject,
                'chapter': exam_snapshot.chapter,
                'class_name': exam_snapshot.class_name,
                'total_questions': exam_snapshot.total_questions,
                'total_marks': exam_snapshot.total_marks,
                'total_time_minutes': exam_snapshot.total_time_minutes,
                'negative_marks_value': exam_snapshot.negative_marks_value,
                'examiner_name': exam_snapshot.examiner_name,
            },
            'leaderboard': leaderboard_data,
            'my_rank': current_user_rank
        }), 200

    except Exception as e:
        print(f"Error fetching leaderboard: {str(e)}")
        return jsonify({'error': 'Failed to fetch leaderboard data'}), 500


# -----------------------------
# Register Blueprint
# -----------------------------
def init_app(app):
    app.register_blueprint(examinee_previous_attempt_exam_bp)
