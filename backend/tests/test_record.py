import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/record'

# this test is used for testing adding new record
def test_add_record(api_url):
    data = {
        "SSN": "111-22-3333",
        "patient_id": 3,
        "physician_id": 1,
        "medicines": ["Acetaminophen", "atenolol"],
        "complete_date": "2024-03-25 20:10:00",
        "encounter_summary": "this is the encounter summary",
        "diagnosis": "this is the diagnosis",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "uPW7OBVEbUvfz9M/v5VGLZuKNvgXUGyn0XFnnGyC/BBHBOVEQ7eiUvY2Bm/AvNtCeErsCHD/9XmFpHNyhXPXiaAWG3HnUum2wN0HcAJma7w9i5cODyt5jpTTa743mVbZGLU/ZDJj9yxMC7A0Zn9xLvBZkOzovETxpHDFrWFQSXdpC902hkAgKG9YNmQ4Q48c7gYknXpawe6OdTKg929HWtenoPkTDERrL9fd2BRn6adoETF3GId52JGYW9crDGOdqRlz7FQbw1l7wnH6rgPQm+WXsXMz4JBhil9FM0mE0vUgX8gd6RdpVR1dL/K9Z90W+gdZwCmo9KxZAEGdGu1o8w=="
    }

    response = requests.put(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "SSN": "666-66-6666",
        "patient_id": 3,
        "physician_id": 1,
        "medicines": [],
        "complete_date": "2024-03-25 20:10:00",
        "encounter_summary": "balabala",
        "diagnosis": "balabala",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "ZkqzLgD956FlGVeNcZMsjJYfoFteUIM06CQdSwlfbMD1r2QAFqMQlpfMhzrDNxuFDHicTrhzbb2k5MWbcC1pKnDnPiLtNRdZD0HGIMMmPC92f9TUj6dHtM4tasTl0/pWcQLUou3rdvJCU5n8HppFMblWB7tjYMVhxvSpEi8zD2B1ztllYnkV4C/ixh1C+a9gSrqkIYD90XPqSWHMAGhoS0aNYiztPcGvtYQ82dg8IvgIV3e2EjKYMm8AKFR29kFvCFwGNORlxG87NLY0lTcMnKgkZJa1wBceklHnr8ytbmvkRQ4LWNavW5a8e3PjvgjTXb0Bh6FHDG8IE+2SKRzsCw=="
    }

    response = requests.put(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

# this test is used for testing getting record
def test_get_record(api_url):
    params = {
        'patient_id': '3',
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "J3W6RBT3+Dwwd1KSZZpC0Pkt2KVq34Bz529bDNvx3ust1B5sbskVk78Q1iNj1gT3LGLqu3fpeguwAaXfgbN4ZlnsA6Zkts4VGjRaE/lxoHyQTDatqWMSSEjOZawNUi3AXgoL5rkA2+/6BEd28nPYZrkO+Ngjznu1YpyLXPnPHm4U65gMgh2b7wNNJPoSi3e4vPtDsr2y6QyrlEOB2+iN2Nc9YEBrI/H7Y7MAULl8cJUVOnv58JjhitkPWkuknXUVhAXGLsor8AvdRx6nIdQPIirMINJBvVpL5jbNjkKaBFgg6XDGTwGirV6He+ntoq3uTbeYwZf5tYrbZ6LAyxMDnw=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["records"]

    # should have at least one code
    assert len(content) != 0

    for record in content:
        # patient id should match
        assert record["patient_id"] == 3

    # try another one
    params = {
        'patient_id': '1',
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "QO/l3v+shtZxuxebeP326LwpQQcJ3kBdOfBclvcHQE1lnmjdTPoDsIWU4f9rOE3FOi2dzzzMWRMAOuWkZU1h6BjZ6bo5DR78J0i9GHInxcRTBaZ+Xq70SfUR8WhGWrbL32Hh9t/Nz20VR94JJxOjJUntHyHWqI9ql44BlwVLJ7JkDBBGnQP3zwVtflpyJaSRYwOxui3lBqilJSghFrRJbYVHcoynL6dk6DHVnAd5SYS/sYuf61PGrP191CBHQ15sQtiU9Hx6VHq/wfSNfnnYdH6xGSJDsyjPWpCBh0zhaH8H+OISMBDFjyT33UE6lR22JwMdvpjEg1PlJq992lN3cw=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["records"]

    # should have at least one code
    assert len(content) != 0

    for record in content:
        # patient id should match
        assert record["patient_id"] == 1