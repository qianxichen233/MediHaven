import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/medicines'

# this test is used for testing getting a list of medicines
def test_medicines(api_url):
    params = {
        'type': 'Sedatives',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["medicines"]

    # response should have at least one medicine
    assert len(content) != 0

    for medicine in content:
        # test for medicine type
        assert medicine["type"] == "Sedatives"

    # try another one
    params = {
        'type': 'Antibiotics',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["medicines"]

    # response should have at least one medicine
    assert len(content) != 0

    for medicine in content:
        # test for medicine type
        assert medicine["type"] == "Antibiotics"

    # try another one
    params = {
        'type': 'Cardiovascular',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["medicines"]

    # response should have at least one medicine
    assert len(content) != 0

    for medicine in content:
        # test for medicine type
        assert medicine["type"] == "Cardiovascular"

# this test is used for testing getting a list of medicines with non-existing type
def test_medicines_non_existing(api_url):
    params = {
        'type': 'non-existing',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["medicines"]

    # response should have no medicine
    assert len(content) == 0