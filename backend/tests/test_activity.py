def test_activity_log_created(client, db_session):
    payload = {
        "Body": {
            "stkCallback": {
                "ResultCode": 0,
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 50},
                        {"Name": "MpesaReceiptNumber", "Value": "LOG123"},
                        {"Name": "PhoneNumber", "Value": 254700000111}
                    ]
                }
            }
        }
    }
    client.post("/payments/callback", json=payload)

    response = client.get("/activity/")
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) >= 1
    assert "Payment Success" in logs[0]["action"]
