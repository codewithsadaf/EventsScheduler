from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)  # New field for end time
    is_recurring = db.Column(db.Boolean, default=False)
    days_of_week = db.Column(db.String)  # comma-separated days for recurring events

    def __repr__(self):
        return f"<Event {self.name}>"
