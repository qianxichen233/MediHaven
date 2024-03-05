import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/login'

# this test is used for testing admin login
def test_admin_login(api_url):
    data = {
        "account_type": "admin",
        "email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "RqJEM6hZJbfooCNW7Duyto7SBeOckskao38YAton8PqtR1QUIbDDqurRrqQ3vRccHUpWcM/nEhRLsXLVgiTjzNYCyQY/tRbXl+9z5lb7DYlTFVrNC/AVhnT0J8DkWn9iVKbC9gO3lwMibUq3iNJj1K/5nCFB6gNTTnCVP9cNOiuSuJFGa57luBkE5rJq7ap2aaS0abPxKLYLp/IUsyPZL7FhkxnMrQkLLe/7NCVbkxBqU35owDS5c3rXWALwD0llk5CaiVwkrrMr11pOZn9BL2YAPcOIEderjMEg2zbwubY0zMCfAfXVYjAZdd3rhSrcb5og3MAyl6Lw5SBzmed5fw=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

# this test is used for testing physician login
def test_physician_login(api_url):
    data = {
        "account_type": "physician",
        "email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "RqJEM6hZJbfooCNW7Duyto7SBeOckskao38YAton8PqtR1QUIbDDqurRrqQ3vRccHUpWcM/nEhRLsXLVgiTjzNYCyQY/tRbXl+9z5lb7DYlTFVrNC/AVhnT0J8DkWn9iVKbC9gO3lwMibUq3iNJj1K/5nCFB6gNTTnCVP9cNOiuSuJFGa57luBkE5rJq7ap2aaS0abPxKLYLp/IUsyPZL7FhkxnMrQkLLe/7NCVbkxBqU35owDS5c3rXWALwD0llk5CaiVwkrrMr11pOZn9BL2YAPcOIEderjMEg2zbwubY0zMCfAfXVYjAZdd3rhSrcb5og3MAyl6Lw5SBzmed5fw=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

# this test is used for testing receptionist login
def test_receptionist_login(api_url):
    data = {
        "account_type": "receptionist",
        "email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "RqJEM6hZJbfooCNW7Duyto7SBeOckskao38YAton8PqtR1QUIbDDqurRrqQ3vRccHUpWcM/nEhRLsXLVgiTjzNYCyQY/tRbXl+9z5lb7DYlTFVrNC/AVhnT0J8DkWn9iVKbC9gO3lwMibUq3iNJj1K/5nCFB6gNTTnCVP9cNOiuSuJFGa57luBkE5rJq7ap2aaS0abPxKLYLp/IUsyPZL7FhkxnMrQkLLe/7NCVbkxBqU35owDS5c3rXWALwD0llk5CaiVwkrrMr11pOZn9BL2YAPcOIEderjMEg2zbwubY0zMCfAfXVYjAZdd3rhSrcb5og3MAyl6Lw5SBzmed5fw=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

