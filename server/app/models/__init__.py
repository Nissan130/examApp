# Import database instance
from .base_model import db

# Import all models from subfolders
from .authModels import User
from .examinerModels.createExamModels import Exam, Question
from .examineeModels.attemptExamResultModel import ExamineeAttemptExamResult, ExamineeAttemptQuestions

__all__ = [
    'db',
    'User',
    'Exam',
    'Question',
    'ExamineeAttemptExamResult',
    'ExamineeAttemptQuestions'
]

