import os
from contextlib import suppress

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, OperationalError
from werkzeug.security import generate_password_hash

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "postgresql://appuser:apppass@localhost:5432/appdb",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

    db.init_app(app)
    CORS(app)

    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # Schema is managed by Alembic. Seed default users if tables exist and none are present.
    with app.app_context():
        _seed_default_users()

    return app


def _seed_default_users():
    from app.models import User

    try:
        if User.query.first() is not None:
            return
    except OperationalError:
        # Tables do not exist yet (e.g., during tests before db.create_all()).
        return

    users = [
        User(username="admin", password_hash=generate_password_hash("admin123")),
        User(username="user", password_hash=generate_password_hash("user123")),
    ]
    for user in users:
        db.session.add(user)

    with suppress(IntegrityError):
        db.session.commit()

    db.session.rollback()
