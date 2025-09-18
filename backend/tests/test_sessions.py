def test_payment_flow(client, db_session):
    # Fake callback payload
    payload = {
        "Body": {
            "stkCallback": {
                "ResultCode": 0,
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 50},
                        {"Name": "MpesaReceiptNumber", "Value": "ABC123XYZ"},
                        {"Name": "PhoneNumber", "Value": 254700000111}
                    ]
                }
            }
        }
    }

    response = client.post("/payments/callback", json=payload)
    assert response.status_code == 200

    # Verify payment in db
    response = client.get("/payments/")
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "Success"
