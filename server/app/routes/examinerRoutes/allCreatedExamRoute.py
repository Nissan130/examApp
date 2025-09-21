from flask import Blueprint, request, jsonify
from app.models import db, ExaminerCreatedExam, ExaminerCreatedExamQuestion,ExamineeAttemptExams, ExamineeAttemptExamQuestions
import uuid
from app.utils.cloudinary_utils import upload_image
from app.routes.authRoutes.userRoutes import token_required
import json

all_created_exam_bp = Blueprint("all_created_exam", __name__, url_prefix="/api/examiner")

# -----------------------------
# Get all exams created by the logged-in user (without status/delete)
# -----------------------------
@all_created_exam_bp.route('/my-created-exams', methods=['GET'])
@token_required
def get_my_exams(user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        exams_query = ExaminerCreatedExam.query.filter_by(user_id=user.id)
        total_exams = exams_query.count()

        exams = exams_query.order_by(ExaminerCreatedExam.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        exams_list = []
        for exam in exams.items:
            exams_list.append({
                'exam_id': str(exam.exam_id),
                'exam_name': exam.exam_name,
                'exam_code': exam.exam_code,
                'subject': exam.subject,
                'chapter': exam.chapter,
                'class_name': exam.class_name,
                'total_marks': exam.total_marks,
                'total_time_minutes': exam.total_time_minutes,
                'created_at': exam.created_at.isoformat() if exam.created_at else None,
                'question_count': len(exam.questions) if exam.questions else 0
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

# -----------------------------
# Get detailed exam with questions
# -----------------------------
@all_created_exam_bp.route('/my-created-exams/view-created-exam/<exam_id>', methods=['GET'])
@token_required
def get_exam_details(user, exam_id):
    try:
        exam = ExaminerCreatedExam.query.filter_by(exam_id=uuid.UUID(exam_id), user_id=user.id).first()
        if not exam:
            return jsonify({'status': 'error', 'message': 'Exam not found'}), 404

        exam_data = {
            'exam_id': str(exam.exam_id),
            'exam_name': exam.exam_name,
            'exam_code': exam.exam_code,
            'subject': exam.subject,
            'chapter': exam.chapter,
            'class_name': exam.class_name,
            'description': exam.description,
            'total_marks': exam.total_marks,
            'passing_marks': exam.passing_marks,
            'total_time_minutes': exam.total_time_minutes,
            'attempts_allowed': exam.attempts_allowed,
            'negative_marks_value': exam.negative_marks_value,
            'examiner_name': exam.examiner_name,
            'created_at': exam.created_at.isoformat() if exam.created_at else None,
            'updated_at': exam.updated_at.isoformat() if exam.updated_at else None,
            'questions': []
        }

        for question in exam.questions:
            exam_data['questions'].append({
                'question_id': str(question.question_id),
                'question_text': question.question_text,
                'question_image_url': question.question_image_url,
                'question_image_id': question.question_image_id,
                'marks': question.marks,
                'question_order': question.question_order,
                'options': {
                    'A': {'text': question.optA_text, 'image_url': question.optA_image_url, 'image_id': question.optA_image_id},
                    'B': {'text': question.optB_text, 'image_url': question.optB_image_url, 'image_id': question.optB_image_id},
                    'C': {'text': question.optC_text, 'image_url': question.optC_image_url, 'image_id': question.optC_image_id},
                    'D': {'text': question.optD_text, 'image_url': question.optD_image_url, 'image_id': question.optD_image_id}
                },
                'correct_answer': question.correct_answer
            })

        return jsonify({'status': 'success', 'exam': exam_data})

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch exam details',
            'details': str(e)
        }), 500


# ======== update exam and questions===========

from datetime import datetime  # Add this import


# -----------------------------
# Update an existing exam
# -----------------------------
# -----------------------------
# Update an existing exam
# -----------------------------
@all_created_exam_bp.route('/my-created-exams/update-exam/<exam_id>', methods=['PUT'])
@token_required
def update_exam(user, exam_id):
    try:
        # Get the exam to update
        exam = ExaminerCreatedExam.query.filter_by(exam_id=uuid.UUID(exam_id), user_id=user.id).first()
        if not exam:
            return jsonify({'status': 'error', 'message': 'Exam not found'}), 404

        # Load data from form or JSON
        if 'exam_data' in request.form:
            data = json.loads(request.form.get("exam_data"))
        else:
            data = request.get_json()
            if not data:
                return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        # Update exam details
        exam.exam_name = data.get('exam_name', exam.exam_name)
        exam.subject = data.get('subject', exam.subject)
        exam.chapter = data.get('chapter', exam.chapter)
        exam.class_name = data.get('class_name', exam.class_name)
        exam.description = data.get('description', exam.description)
        exam.total_marks = data.get('total_marks', exam.total_marks)
        exam.passing_marks = data.get('passing_marks', exam.passing_marks)
        exam.total_time_minutes = data.get('total_time_minutes', exam.total_time_minutes)
        exam.attempts_allowed = data.get('attempts_allowed', exam.attempts_allowed)
        exam.negative_marks_value = data.get('negative_marks_value', exam.negative_marks_value)
        exam.examiner_name = data.get('examiner_name', exam.examiner_name)
        exam.updated_at = datetime.utcnow()

        # Handle datetime fields
        start_datetime = data.get('start_datetime')
        end_datetime = data.get('end_datetime')
        exam.start_datetime = datetime.fromisoformat(start_datetime.replace('Z', '+00:00')) if start_datetime else None
        exam.end_datetime = datetime.fromisoformat(end_datetime.replace('Z', '+00:00')) if end_datetime else None

        # Update questions
        if 'questions' in data:
            # Delete existing questions
            ExaminerCreatedExamQuestion.query.filter_by(exam_id=exam.exam_id).delete()

            for i, q_data in enumerate(data['questions']):
                # Question image
                q_image_url = q_data.get('question_image_url')
                q_image_id = q_data.get('question_image_id')

                q_file = request.files.get(f"question_{i + 1}_image")
                if q_file:
                    upload_result = upload_image(q_file, folder="exam-app/questions")
                    q_image_url = upload_result["url"]
                    q_image_id = upload_result["public_id"]
                else:
                    # Retain existing URL and ID if no new file
                    if q_image_url:
                        q_image_url = q_data.get('question_image_url')
                    if q_image_id:
                        q_image_id = q_data.get('question_image_id')

                question = ExaminerCreatedExamQuestion(
                    question_id=uuid.uuid4(),
                    exam_id=exam.exam_id,
                    question_text=q_data.get('question_text', ''),
                    question_image_url=q_image_url,
                    question_image_id=q_image_id,
                    question_order=q_data.get('question_order', i + 1),
                    marks=q_data.get('marks', 1.0),
                    optA_text=q_data.get('optA_text', ''),
                    optB_text=q_data.get('optB_text', ''),
                    optC_text=q_data.get('optC_text', ''),
                    optD_text=q_data.get('optD_text', ''),
                    correct_answer=q_data.get('correct_answer', ''),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )

                # Option images
                for opt_key in ["A", "B", "C", "D"]:
                    o_file = request.files.get(f"question_{i + 1}_opt{opt_key}_image")
                    if o_file:
                        upload_result = upload_image(o_file, folder="exam-app/options")
                        setattr(question, f"opt{opt_key}_image_url", upload_result["url"])
                        setattr(question, f"opt{opt_key}_image_id", upload_result["public_id"])
                    else:
                        # Retain existing URL and ID
                        opt_url = q_data.get(f"opt{opt_key}_image_url")
                        opt_id = q_data.get(f"opt{opt_key}_image_id")
                        if opt_url:
                            setattr(question, f"opt{opt_key}_image_url", opt_url)
                        if opt_id:
                            setattr(question, f"opt{opt_key}_image_id", opt_id)

                db.session.add(question)

        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Exam updated successfully',
            'exam_id': str(exam.exam_id)
        })

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to update exam',
            'details': str(e)
        }), 500


# -----------------------------
# Delete an exam
# -----------------------------
@all_created_exam_bp.route('/my-created-exams/delete-exam/<exam_id>', methods=['DELETE'])
@token_required
def delete_exam(user, exam_id):
    try:
        # Get the exam to delete
        exam = ExaminerCreatedExam.query.filter_by(exam_id=uuid.UUID(exam_id), user_id=user.id).first()
        if not exam:
            return jsonify({'status': 'error', 'message': 'Exam not found'}), 404

        # Delete the exam (this will cascade delete related questions due to the relationship)
        db.session.delete(exam)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Exam deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to delete exam',
            'details': str(e)
        }), 500


# Attempt exam result leaderboard
@all_created_exam_bp.route('/taken-exam-result/<exam_id>/leaderboard', methods=['GET'])
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
        }), 200

    except Exception as e:
        print(f"Error fetching leaderboard: {str(e)}")
        return jsonify({'error': 'Failed to fetch leaderboard data'}), 500



# -----------------------------
# Register Blueprint
# -----------------------------
def init_app(app):
    app.register_blueprint(all_created_exam_bp)