from datetime import datetime
from ..base_model import db, BaseModel
from sqlalchemy.dialects.postgresql import UUID
import uuid

# -----------------------------
# Exams Table
# -----------------------------
class Exam(BaseModel):
    __tablename__ = "exams"
    exam_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    exam_name = db.Column(db.String(255), nullable=False)
    exam_code = db.Column(db.String(20), unique=True, nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    chapter = db.Column(db.String(255), nullable=False)
    class_name = db.Column(db.String(255), nullable=False)
    
    description = db.Column(db.Text)
    total_marks = db.Column(db.Integer, nullable=False)
    passing_marks = db.Column(db.String(100))
    total_time_minutes = db.Column(db.Integer, nullable=False)
    start_datetime = db.Column(db.DateTime)
    end_datetime = db.Column(db.DateTime)
    attempts_allowed = db.Column(db.String(20), default="single")
    negative_marks_value = db.Column(db.Float)
    examiner_name = db.Column(db.String(255))

    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    questions = db.relationship("Question", backref="exam", cascade="all, delete-orphan")


# -----------------------------
# Questions Table
# -----------------------------
class Question(BaseModel):
    __tablename__ = "questions"
    question_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    exam_id = db.Column(UUID(as_uuid=True), db.ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False)

    question_text = db.Column(db.Text, nullable=False)
    question_image_url = db.Column(db.Text)   # Cloudinary URL for question image
    question_image_id = db.Column(db.String(255))  # Cloudinary public_id for question image

    # -----------------------------
    # Options (text + image url + image id)
    # -----------------------------
    optA_text = db.Column(db.Text, nullable=False)
    optA_image_url = db.Column(db.Text)
    optA_image_id = db.Column(db.String(255))

    optB_text = db.Column(db.Text, nullable=False)
    optB_image_url = db.Column(db.Text)
    optB_image_id = db.Column(db.String(255))

    optC_text = db.Column(db.Text, nullable=False)
    optC_image_url = db.Column(db.Text)
    optC_image_id = db.Column(db.String(255))

    optD_text = db.Column(db.Text, nullable=False)
    optD_image_url = db.Column(db.Text)
    optD_image_id = db.Column(db.String(255))

    correct_answer = db.Column(db.String(10), nullable=False)  # "A", "B", "C", "D"

    marks = db.Column(db.Float, default=1.0)
    question_order = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
