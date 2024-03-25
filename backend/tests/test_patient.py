import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/patient'

# this test is used for testing registering new patient
def test_patient_register(api_url):
    data = {
        "SSN": "111-22-3333",
        "First_Name": "Qianxi",
        "Last_Name": "Chen",
        "Sex": "Male",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Insurance_ID": "1",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "jafMMGWiDexMy1TnM+DiI4kiQvQ3/K/6ejWjvOK98J+NmC1Yuyp5PlUDeDFuyu6c8cIjooKZ0ebUiiGJk98srV8XG6EdlxYHImEuxXZDJXhyViEzIsT//PsgGTikTmpofVwhFp/e0ARonL9uUKzwy2Y5iPgV7GK2dpdfBg/f+Go3GQYQkQFz8rs+t5dalTvr2ecb4Omjd+Awhjn24Zu6B88lQh8wN820U7WZcNGW8pym/MZZv9UmqgOLg6AEJZyj4xMa5gSPMVqQboiHkJWuI6xxSma7XJyz/gSm+TEdQm8BDjPzkEddwckSZhaprwR2rJuajcOSoprDyG2N0CCiwg=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "SSN": "666-66-6666",
        "First_Name": "test",
        "Last_Name": "test",
        "Sex": "Male",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Insurance_ID": "1",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "K3uwcJkHtK3+XSARAp7iOdjuVMKWmZk0kHm56Eszb/TWxqITmGUPJAd9w6XKSLmI5ua2KJLLBDohWiUH/XU1lr4GzWg4MLANWaXvrwq7TV6nK64enOyuF0bWFSYdACsx1lquzBBRuAQd3jO3za9DiZUm9DsYvgSKutYnQxn0Ey8FAO+z0b1MwEO5565AAvtxFnIaaahYtphKYou7FB3Q2F1+PDx18ftV0JurPtkGIyotQ7JPV6p0WxHxeR1YhPrJUQKdJSBomgg89pyr8AVX2MjYYC+ByQLiYiwPfPWtBmNTYj0kxkbd1Qh4RkCXB8n7eSUT9slrqNv8WuGtoQa/rQ=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200