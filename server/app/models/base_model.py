from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True
    
    def save(self):
        db.session.add(self)
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error saving: {e}")
            return False
    
    def delete(self):
        db.session.delete(self)
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting: {e}")
            return False