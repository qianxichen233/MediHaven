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

# this test is used for testing registering new patient with invalid signature
def test_patient_register_invalid_signature(api_url):
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
        "X-Signature": "invalid"
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should not be successful
    assert response.status_code != 200

# this test is used for testing getting patient information
def test_patient_get(api_url):
    params = {
        'SSN': '111-22-3333',
        "timestamp": "2024-03-25 20:10:00",
        "issuer_email": "qc815@nyu.edu"
    }

    headers = {
        "X-Signature": "uCKKZTK89ElO2wr2iZnmOHDLm9IWvcE0L6OJRHg/ALUg3HC+yGZ024Zh9Ur9aulzPkapW+77wn1igubAD9J9mOjWqRbmXHg+wEyp2xAscSzLyRutL9sA5f3yKk2nrSWjYjwMWf1RWBkKMbMSvu2d/Hz6ncjkfVds2AoB4WS6Ylud5XOlGh53pPhVclOkgMm0XNE9gcAy4MKaHhH68lNqa4bAMbqWv74lF7zPI9hRNFvRHdaTAh0jMZv+g2AWoJ0jKzgp8EsuRZ92AyXv2DNZz6eVcelpBN6Ju8isi70vgadIvkanGUrpqtcpR0QzH5VsbakSNof9I9w6paltED48mw=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()

    # should have a patient
    assert content != None

    # SSN should match
    assert content["patient"]["SSN"] == "111-22-3333"

    # try another one
    params = {
        'SSN': '666-66-6666',
        "timestamp": "2024-03-25 20:10:00",
        "issuer_email": "qc815@nyu.edu"
    }

    headers = {
        "X-Signature": "pUjX7zDEHhHK/JiwfT9c8BGvTPX4W45IGCRPMmlvBB+W+6lIL2iTFy+wm+haWXB8CZoK4zA0LjBd2mpqduo8ap5QO/y4rQs0QrNeP+sbzstXhrD41o1qIBYWZVhqBZWEtOKOSfDhFRVIuw0RQzH0WAOGTU2PMtC23JsCx6vW4J82XLPfdr4jozLRs/APVMC39Bq4K1LaKE27D3ABHSHDTnjO63i5ur6cg+fYzWaqCbenb5OaKxQpaqu4ISw0p+/ISsko7cqoEaW9nk4dOd5+X6nmm28SDx185BOUmunBw7cTL9/RAfmMnQIqS4/YVCZ8c2/cQtGQ8fiLwl95i3dlew=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()

    # should have a patient
    assert content != None

    # SSN should match
    assert content["patient"]["SSN"] == "666-66-6666"


# this test is used for testing getting patient information with invalid signature
def test_patient_get_invalid_signature(api_url):
    params = {
        'SSN': '111-22-3333',
        "timestamp": "2024-03-25 20:10:00",
        "issuer_email": "qc815@nyu.edu"
    }

    headers = {
        "X-Signature": "invalid"
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should not be successful
    assert response.status_code != 200