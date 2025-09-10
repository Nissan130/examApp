# Import database instance
from .base_model import db

# Import all models from sub-folders
from .authModels import User

# Optional: add other subfolder models here
# from .examineeModels import Examinee
# from .examinerModels import Examiner

__all__ = ['db', 'User']
