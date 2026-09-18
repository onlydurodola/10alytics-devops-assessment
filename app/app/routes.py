from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from app import db
from app.auth import generate_token, login_user, token_required
from app.models import Task, User

api_bp = Blueprint("api", __name__)


@api_bp.route("/health", methods=["GET"])
def health():
    try:
        task_count = Task.query.count()
        return jsonify({"status": "healthy", "database": {"ok": True, "tasks": task_count}})
    except Exception as exc:  # noqa: BLE001
        return jsonify({"status": "unhealthy", "database": {"ok": False, "detail": str(exc)}}), 503


@api_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    result, error = login_user(data["username"], data["password"])
    if error:
        return jsonify({"error": error}), 401
    return jsonify(result), 200


@api_bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    existing = User.query.filter_by(username=data["username"]).first()
    if existing:
        return jsonify({"error": "Username already exists"}), 409

    new_user = User(
        username=data["username"],
        password_hash=generate_password_hash(data["password"]),
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "token": generate_token(new_user.id, new_user.username),
        "user": new_user.to_dict(),
    }), 201


@api_bp.route("/tasks", methods=["GET"])
@token_required
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200


@api_bp.route("/tasks", methods=["POST"])
@token_required
def create_task():
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Title is required"}), 400

    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        priority=data.get("priority", "medium"),
        status=data.get("status", "todo"),
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@api_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@token_required
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    for field in ["title", "description", "priority", "status"]:
        if field in data:
            setattr(task, field, data[field])

    db.session.commit()
    return jsonify(task.to_dict()), 200


@api_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 200
