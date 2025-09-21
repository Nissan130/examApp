# Import database instance
from .base_model import db

# Import all models from subfolders
from .authModels import User
from .examinerModels.createExamModels import ExaminerCreatedExam, ExaminerCreatedExamQuestion
from .examineeModels.examineeAttemptExamsModel import ExamineeAttemptExams, ExamineeAttemptExamQuestions

__all__ = [
    'db',
    'User',
    'ExaminerCreatedExam',
    'ExaminerCreatedExamQuestion',
    'ExamineeAttemptExams',
    'ExamineeAttemptExamQuestions'
]

