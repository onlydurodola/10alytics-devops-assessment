import os
from functools import wraps

import jwt
from flask import jsonify, request
from werkzeug.security import check_password_hash

from app.models import User

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")


def generate_token(user_id, username):
    return jwt.encode({"user_id": user_id, "username": username}, SECRET_KEY, algorithm="HS256")


def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except (jwt.InvalidTokenError, jwt.DecodeError):
        return None


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Invalid token format"}), 401

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        request.user_id = payload.get("user_id")
        request.username = payload.get("username")
        return f(*args, **kwargs)

    return decorated


def login_user(username, password):
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return None, "Invalid username or password"
    return {"token": generate_token(user.id, user.username), "user": user.to_dict()}, None
