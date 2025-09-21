from datetime import datetime
from ..base_model import db, BaseModel
from sqlalchemy.dialects.postgresql import UUID
import uuid

# -----------------------------
# ExaminerCreatedExam Table
# -----------------------------
class ExaminerCreatedExam(BaseModel):
    __tablename__ = "examiner_created_exams"  # updated table name
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

    questions = db.relationship(
        "ExaminerCreatedExamQuestion",
        backref="exam",
        cascade="all, delete-orphan"
    )


# -----------------------------
# ExaminerCreatedExamQuestions Table
# -----------------------------
class ExaminerCreatedExamQuestion(BaseModel):
    __tablename__ = "examiner_created_exam_questions"  # updated table name
    question_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    exam_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("examiner_created_exams.exam_id", ondelete="CASCADE"),
        nullable=False
    )
    question_text = db.Column(db.Text, nullable=False)
    question_image_url = db.Column(db.Text)
    question_image_id = db.Column(db.String(255))

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

    correct_answer = db.Column(db.String(10), nullable=False)
    marks = db.Column(db.Float, default=1.0)
    question_order = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
