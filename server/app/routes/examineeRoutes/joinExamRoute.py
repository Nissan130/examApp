from flask import Blueprint, request, jsonify
from app.models import User, db, Exam

enter_exam_code_bp = Blueprint('enter_exam_code', __name__, url_prefix='/api/examinee/')

# ----------------------------
# Login
# ----------------------------
@enter_exam_code_bp.route('/enter-exam-code', methods=['POST'])
def enterExamCode():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    exam_code = data.get('exam_code')

    if not exam_code:
        return jsonify({'error': 'Exam code is required'}), 400

    #fetch exams by exam code
    exam = Exam.query.filter_by(exam_code=exam_code).first()
    if not exam:
        return jsonify({'status':'error', 'message': 'Invalid Exam Code'}), 404

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

    return jsonify({
        'status': "success",
        'message': 'Got Exam successfully',
        'exam_data': exam_data
    }), 200