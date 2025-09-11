from flask import Blueprint, request, jsonify
from app.models import db, Exam, Question
import uuid
from app.utils.cloudinary_utils import upload_image
from app.routes.authRoutes.userRoutes import token_required
import json

create_exam_bp = Blueprint("create_exam_bp", __name__, url_prefix="/api/exam")

# -----------------------------
# Create Exam with Questions (all in one request)
# -----------------------------
@create_exam_bp.route("/create-exam", methods=["POST"])
@token_required
def create_full_exam(user):
    """
    Expects multipart/form-data with:
    - exam_data (JSON string) containing exam + questions
    - question images as files: question_1_image, question_2_image, ...
    - option images as files: question_1_optA_image, question_1_optB_image, ...
    """
    try:

         # Check if exam_data exists
        if 'exam_data' not in request.form:
            return jsonify({"status": "error", "message": "exam_data is required"}), 400
        
        # Parse JSON data
        data = json.loads(request.form.get("exam_data"))
        
        # Validate required fields
        required_fields = ['exam_name', 'subject', 'chapter', 'class_name', 'total_marks', 'total_time_minutes']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"status": "error", "message": f"{field} is required"}), 400
       
       
       
        # Parse JSON data
        data = json.loads(request.form.get("exam_data"))

        # 1️⃣ Create Exam
        new_exam = Exam(
            exam_id=uuid.uuid4(),
            exam_name=data.get("exam_name"),
            subject=data.get("subject"),
            chapter=data.get("chapter"),
            class_name=data.get("class_name"),
            description=data.get("description"),
            total_marks=data.get("total_marks"),
            passing_marks=data.get("passing_marks"),
            total_time_minutes=data.get("total_time_minutes"),
            start_datetime=data.get("start_datetime"),
            end_datetime=data.get("end_datetime"),
            attempts_allowed=data.get("attempts_allowed", "single"),
            negative_marks_value=data.get("negative_marks_value"),
            examiner_name=data.get("examiner_name"),
            user_id=uuid.UUID(str(user.id))
        )
        db.session.add(new_exam)
        db.session.flush()  # get new_exam.exam_id for FK

        # 2️⃣ Create Questions
        for q_idx, q in enumerate(data.get("questions", []), start=1):
            # Question image
            q_file = request.files.get(f"question_{q_idx}_image")
            q_image_url, q_image_id = None, None
            if q_file:
                upload_result = upload_image(q_file, folder="exam-app/questions")
                q_image_url = upload_result["url"]
                q_image_id = upload_result["public_id"]

            new_question = Question(
                question_id=uuid.uuid4(),
                exam_id=new_exam.exam_id,
                question_text=q.get("question_text"),
                marks=q.get("marks", 1.0),
                question_order=q.get("question_order", q_idx),
                question_image_url=q_image_url,
                question_image_id=q_image_id,
                # Options
                optA_text=q.get("optA_text"),
                optB_text=q.get("optB_text"),
                optC_text=q.get("optC_text"),
                optD_text=q.get("optD_text"),
                correct_answer=q.get("correct_answer")
            )

            # Option images
            for opt_key in ["A", "B", "C", "D"]:
                o_file = request.files.get(f"question_{q_idx}_opt{opt_key}_image")
                if o_file:
                    upload_result = upload_image(o_file, folder="exam-app/options")
                    setattr(new_question, f"opt{opt_key}_image_url", upload_result["url"])
                    setattr(new_question, f"opt{opt_key}_image_id", upload_result["public_id"])

            db.session.add(new_question)

        db.session.commit()
        return jsonify({"status": "success", "exam_id": str(new_exam.exam_id)})

    except json.JSONDecodeError:
        return jsonify({"status": "error", "message": "Invalid JSON in exam_data"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500



# -----------------------------
# Register Blueprint
# -----------------------------
def init_app(app):
    app.register_blueprint(create_exam_bp)
