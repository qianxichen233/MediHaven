import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/physician'

# this test is used for testing getting physician based on department
def test_physician_department(api_url):
    params = {
        'department': 'Nephrology',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for department
        assert physician["department"] == "Nephrology"

    # try another one
    params = {
        'department': 'Gastroenterology',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for department
        assert physician["department"] == "Gastroenterology"

# this test is used for testing getting physician based on invalid department
def test_physician_department_non_existing(api_url):
    params = {
        'department': 'non-existing',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have no physician
    assert len(content) == 0

# this test is used for testing getting physician based on name
def test_physician_name(api_url):
    params = {
        'name': 'gua gua',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for name
        assert physician["first_name"] == "gua"
        assert physician["last_name"] == "gua"

    # try another one
    params = {
        'name': 'Qianxi Chen',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for name
        assert physician["first_name"] == "Qianxi"
        assert physician["last_name"] == "Chen"

# this test is used for testing getting physician based on non-existing name
def test_physician_name_non_existing(api_url):
    params = {
        'name': 'non-existing',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have no physician
    assert len(content) == 0

# this test is used for testing getting physician based on department and name
def test_physician_all(api_url):
    params = {
        'name': 'gua gua',
        'department': 'Nephrology',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for name
        assert physician["first_name"] == "gua"
        assert physician["last_name"] == "gua"
        # test for department
        assert physician["department"] == "Nephrology"

    # try another one
    params = {
        'name': 'Qianxi Chen',
        'department': 'Gastroenterology',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have at least one physician
    assert len(content) != 0

    for physician in content:
        # test for name
        assert physician["first_name"] == "Qianxi"
        assert physician["last_name"] == "Chen"
        # test for department
        assert physician["department"] == "Gastroenterology"

# this test is used for testing getting physician based on non-existing department and name
def test_physician_all_non_existing(api_url):
    params = {
        'name': 'non-existing',
        'department': 'non-existing',
    }

    response = requests.get(api_url, params=params)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["physicians"]

    # response should have no physician
    assert len(content) == 0

