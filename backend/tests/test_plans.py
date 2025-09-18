from app.database.models.user import User
from .conftest import get_auth_headers   # ✅ import from conftest

def test_create_and_list_plans(client, db_session):
    # 1. Register a normal user
    client.post("/auth/register", json={
        "username": "admin",
        "email": "admin@example.com",
        "password": "admin123",
        "phone_number": "254799182231"
    })

    # 2. Promote them to admin in DB
    user = db_session.query(User).filter_by(email="admin@example.com").first()
    user.is_admin = True
    db_session.commit()

    # 3. Get JWT
    headers = get_auth_headers(client, "admin@example.com", "admin123")

    # 4. Create plan
    response = client.post("/plans/", json={
        "name": "30 mins",
        "price": 50,
        "duration": 30
    }, headers=headers)
    assert response.status_code == 200

    # 5. List plans
    response = client.get("/plans/", headers=headers)
    assert response.status_code == 200
    plans = response.json()
    assert len(plans) == 1
    assert plans[0]["name"] == "30 mins"
