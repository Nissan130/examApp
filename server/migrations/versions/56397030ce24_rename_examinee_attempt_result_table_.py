"""rename examinee_attempt_result table and attempt_result_id column

Revision ID: 56397030ce24
Revises: 6d2325e595b9
Create Date: 2025-09-21 15:31:41.602158

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = '56397030ce24'
down_revision = '6d2325e595b9'
branch_labels = None
depends_on = None


def upgrade():
    # Rename parent table
    op.rename_table("examinee_attempt_exam_results", "examinee_attempt_exams")

    # Rename PK column in parent table
    op.alter_column(
        "examinee_attempt_exams",
        "attempt_result_id",
        new_column_name="attempt_exam_id"
    )

    # Rename child table
    op.rename_table("examinee_attempt_questions", "examinee_attempt_exam_questions")

    # Rename FK column in child table
    op.alter_column(
        "examinee_attempt_exam_questions",
        "attempt_result_id",
        new_column_name="attempt_exam_id"
    )


def downgrade():
    # Reverse child FK column
    op.alter_column(
        "examinee_attempt_exam_questions",
        "attempt_exam_id",
        new_column_name="attempt_result_id"
    )

    # Reverse child table
    op.rename_table("examinee_attempt_exam_questions", "examinee_attempt_questions")

    # Reverse parent PK column
    op.alter_column(
        "examinee_attempt_exams",
        "attempt_exam_id",
        new_column_name="attempt_result_id"
    )

    # Reverse parent table
    op.rename_table("examinee_attempt_exams", "examinee_attempt_exam_results")
