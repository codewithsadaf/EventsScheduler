from flask import Flask, request, jsonify
from models import db, Event
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///events.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.before_request
def create_tables():
    db.create_all()


@app.route("/api/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify(
        [
            {
                "id": event.id,
                "name": event.name,
                "start_time": event.start_time.isoformat(),
                "end_time": event.end_time.isoformat(),
                "is_recurring": event.is_recurring,
                "days_of_week": event.days_of_week,
            }
            for event in events
        ]
    )


@app.route("/api/events", methods=["POST"])
def create_event():
    data = request.get_json()
    name = data.get("title")
    start_time = datetime.fromisoformat(data.get("start").replace("Z", "+00:00"))
    end_time = datetime.fromisoformat(data.get("end").replace("Z", "+00:00"))
    is_recurring = data.get("isRecurring", False)
    days_of_week = ",".join(data.get("recurringDays", []))

    # Validate input
    if not name or not start_time or not end_time:
        return jsonify({"error": "Invalid input"}), 400

    # Check for overlapping events
    if is_recurring:
        # Logic for recurring events
        pass
    else:
        # Logic for one-time events
        overlapping_event = Event.query.filter(
            Event.start_time < end_time, Event.end_time > start_time
        ).first()
        if overlapping_event:
            return jsonify({"error": "Event overlaps with an existing event"}), 409

    new_event = Event(
        name=name,
        start_time=start_time,
        end_time=end_time,
        is_recurring=is_recurring,
        days_of_week=days_of_week,
    )
    db.session.add(new_event)
    db.session.commit()

    return jsonify({"message": "Event created successfully"}), 201


if __name__ == "__main__":
    app.run()
