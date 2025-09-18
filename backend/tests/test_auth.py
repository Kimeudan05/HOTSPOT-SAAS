def test_register_and_login(client):
    # Register
    response = client.post("/auth/register", json={
        "username": "john",
        "email": "john@example.com",
        "password": "secret",
        "phone_number": "254700000111"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "john@example.com"

    # Login
    response = client.post("/auth/login", params={
        "email": "john@example.com",
        "password": "secret"
    })
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token
