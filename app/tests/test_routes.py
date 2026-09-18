import os

import pytest

from app import create_app, db


@pytest.fixture
def app():
    os.environ["DATABASE_URL"] = "sqlite:///test.db"
    app = create_app()
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        _seed_default_users_for_tests()
    yield app
    with app.app_context():
        db.drop_all()


def _seed_default_users_for_tests():
    from werkzeug.security import generate_password_hash

    from app.models import User
    if User.query.first() is None:
        db.session.add_all([
            User(username="admin", password_hash=generate_password_hash("admin123")),
            User(username="user", password_hash=generate_password_hash("user123")),
        ])
        db.session.commit()


@pytest.fixture
def client(app):
    return app.test_client()


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert data["database"]["ok"] is True


def test_login_with_default_user(client):
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
    assert data["user"]["username"] == "admin"


def test_create_and_list_tasks(client):
    login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login.get_json()["token"]

    create = client.post(
        "/api/tasks",
        json={"title": "Test task", "priority": "high"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create.status_code == 201
    assert create.get_json()["title"] == "Test task"

    listing = client.get("/api/tasks", headers={"Authorization": f"Bearer {token}"})
    assert listing.status_code == 200
    assert len(listing.get_json()) == 1
