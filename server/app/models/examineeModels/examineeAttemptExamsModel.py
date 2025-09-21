from datetime import datetime
from ..base_model import db, BaseModel
from sqlalchemy.dialects.postgresql import UUID
import uuid

# -----------------------------
# Exam Attempt Result Overview
# -----------------------------
class ExamineeAttemptExams(BaseModel):
    __tablename__ = "examinee_attempt_exams"

    attempt_exam_id = db.Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        unique=True, nullable=False
    )
    examinee_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    exam_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("exams.exam_id", ondelete="CASCADE"),
        nullable=False
    )

    score = db.Column(db.Float, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    wrong_answers = db.Column(db.Integer, nullable=False)
    unanswered_questions = db.Column(db.Integer, nullable=False)
    time_taken_minutes = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    questions = db.relationship(
        "ExamineeAttemptExamQuestions",
        backref="exam_attempt",
        cascade="all, delete-orphan",
        lazy=True
    )


# -----------------------------
# Per-Question Attempt Snapshot
# -----------------------------
class ExamineeAttemptExamQuestions(BaseModel):
    __tablename__ = "examinee_attempt_exam_questions"

    attempt_question_id = db.Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        unique=True, nullable=False
    )
    attempt_exam_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("examinee_attempt_exams.attempt_exam_id", ondelete="CASCADE"),
        nullable=False
    )

    # 🔹 Snapshot of original question
    original_question_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("questions.question_id", ondelete="SET NULL"),
        nullable=True
    )
    question_text = db.Column(db.Text, nullable=False)
    question_image_url = db.Column(db.Text, nullable=True)
    question_image_id = db.Column(db.String(255), nullable=True)

    # 🔹 Options (max 4)
    option_a_text = db.Column(db.Text, nullable=True)
    option_a_image_url = db.Column(db.Text, nullable=True)
    option_a_image_id = db.Column(db.String(255), nullable=True)

    option_b_text = db.Column(db.Text, nullable=True)
    option_b_image_url = db.Column(db.Text, nullable=True)
    option_b_image_id = db.Column(db.String(255), nullable=True)

    option_c_text = db.Column(db.Text, nullable=True)
    option_c_image_url = db.Column(db.Text, nullable=True)
    option_c_image_id = db.Column(db.String(255), nullable=True)

    option_d_text = db.Column(db.Text, nullable=True)
    option_d_image_url = db.Column(db.Text, nullable=True)
    option_d_image_id = db.Column(db.String(255), nullable=True)

    correct_option_label = db.Column(db.String(5), nullable=False)  # "A", "B", "C", "D"

    # 🔹 Examinee's attempt
    selected_option_label = db.Column(db.String(5), nullable=True)  # null = unanswered
    is_correct = db.Column(db.Boolean, nullable=False, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)