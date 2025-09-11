from flask import Blueprint, request, jsonify
from app.models import db, Exam, Question
import uuid
from app.routes.authRoutes.userRoutes import token_required

all_created_exam_bp = Blueprint("all_created_exam", __name__, url_prefix="/api/exam")

# -----------------------------
# Get all exams created by the logged-in user (without status/delete)
# -----------------------------
@all_created_exam_bp.route('/my-created-exams', methods=['GET'])
@token_required
def get_my_exams(user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        exams_query = Exam.query.filter_by(user_id=user.id)
        total_exams = exams_query.count()

        exams = exams_query.order_by(Exam.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        exams_list = []
        for exam in exams.items:
            exams_list.append({
                'exam_id': str(exam.exam_id),
                'exam_name': exam.exam_name,
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
        exam = Exam.query.filter_by(exam_id=uuid.UUID(exam_id), user_id=user.id).first()
        if not exam:
            return jsonify({'status': 'error', 'message': 'Exam not found'}), 404

        exam_data = {
            'exam_id': str(exam.exam_id),
            'exam_name': exam.exam_name,
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
                'marks': question.marks,
                'question_order': question.question_order,
                'options': {
                    'A': {'text': question.optA_text, 'image_url': question.optA_image_url},
                    'B': {'text': question.optB_text, 'image_url': question.optB_image_url},
                    'C': {'text': question.optC_text, 'image_url': question.optC_image_url},
                    'D': {'text': question.optD_text, 'image_url': question.optD_image_url}
                },
                'correct_answer': question.correct_answer
            })

        return jsonify({'status': 'success', 'exam': exam_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Failed to fetch exam details', 'details': str(e)}), 500

# -----------------------------
# Register Blueprint
# -----------------------------
def init_app(app):
    app.register_blueprint(all_created_exam_bp)
