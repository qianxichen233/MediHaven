import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/code'

# this test is used for testing adding new admin registration code
def test_add_code_admin(api_url):
    data = {
        "email": "qc815@nyu.edu",
        "account_type": "admin",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "b1MbyNFtZDSqD60fbcsLG47gKCfYjt3aIcuIek8xJ88kZmx57zna5acluB1jC8iVUwqibcrN5qo3gvBlGDXvJ432XsU36HX4Z+emUG+5NQ1JwCAbOI7I1rNEvILXrSojKG2LTYtfjl5v+g5kg5HKE9VOB6vJ/sjP/zH0Wk8puLkvXmwQ/k5aHupRseEfQSmoqDi3D83XB/fvFti17sxJcHkNer32UdAWuv2qG/YYifyeCu3W75b1o+pT3j6K4Nb2/NQ+/kUmhg6EfkzsYnXNO447zwDtlKeGjpxsj6Irm4lVTOiRQ23VlO61265Z0gN6420Ufw8HUTN04ZCYzYg7DQ=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()

    # code should be 8 digit long
    assert len(content["code"]) == 8

# this test is used for testing adding new physician code
def test_add_code_physician(api_url):
    data = {
        "email": "qc815@nyu.edu",
        "account_type": "physician",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "qy4TN+uBtJ7NDLHZZX/IAfSqI0CdFieltsRlU06BuuJ/wara//+AaZLnlJP+BzIEU3UmY/F408SgiAh2S3wOpHg2hgJbcITVQ313VmDu3xittySuFKllwYT2hzaNK5okqHiSYuZahp4IuI5GI1/HF76+Z2lNX3egZbgty2EcyBbJVanTHUCZvqnoXFZA5fAAuv3KdQBtezFuGEi+WYFUxPtySaDrmURouxCsn0Sgx6NNwlTFaGvTFE+J1K0phx9HTisyp5JZU+LlbdvqXKPNzGJxvB7MrmdvTvU9YAHxOV9ZRUaZm0yGRr4rZj7PmlXt8j3DbkUoXSaID14LDS2d1w=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()

    # code should be 8 digit long
    assert len(content["code"]) == 8

# this test is used for testing adding new receptionist code
def test_add_code_receptionist(api_url):
    data = {
        "email": "qc815@nyu.edu",
        "account_type": "receptionist",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "Yjl6pDJlOYVyfvppMUU57SLnu+O3irPIgx/k1WFDCcAu2FLFvuu+rvV5MjekkgUVkudUdycNMo57KsUF7RJ0pSsRUrXhdYHu7ZmnhmXLKWkVyFSNdt127j02Z2guYRaBWH8VAkuNZ/lZKZOXTeBMFj3+WS8rEDX9mHhDlZ4yNNAfvwKkZFvyGScZ6etD/6mjKn41S8kjdm1evF7c8Df/Mc1R+yD3ABRYGrl0Q7v4qgyl7vZ3qmD0Pwvll85qs+O7Wq/tYF3tZPpXcQRDioN1FCFT4mpbSfTGoLQYddsB54fOVE/Vmvr5exUg9JdjG5EnM+s5OoN0XNCsGrREdV9cWQ=="
    }

    response = requests.post(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()

    # code should be 8 digit long
    assert len(content["code"]) == 8

# this test is used for testing getting registration code
def test_get_code(api_url):
    params = {
        'email': 'qc815@nyu.edu',
        "timestamp": "2024-03-25 20:10:00",
    }

    headers = {
        "X-Signature": "jOv4sYko51SG+D3rAx4a3Mg6ewPz+GlQiNzH/SumIMsu8whlU06SzOZe6MxED1YGYYf9+mZFKpSnk3QgmWsWg2fxzZf7VZLZhdIgeYB8Uab7e7XDE+QfrAxFNUtPGMFtsR9mBMeZaRjb/ug92RDcLZQoSnrDW5V4zcyTqpc6ed6a8lAhmBRp/7nqD6Yjn9zWiXF5YVAlRCTv/p1/XYsLmSo+O1UxRtR2+oQMsB8D1y1aIBwig8nBGUxoyhEgeOpT98kdpVGCsv9zcSadnj/ezd38bpXLWdSS9KGJ+15NGALB6evJnDDFFs6eYdTwDxxjkztCpWwQY/3hwEZkYr3+wQ=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["codes"]

    # should have at least one code
    assert len(content) != 0

# this test is used for testing delting a registration code
def test_del_code(api_url):
    data = {
        "email": "qc815@nyu.edu",
        "code": "RPIsRwnq6DZWq0FXUBswKOjbl667q4CFDrY71skAhF4gFvfE60uGV19QddwWaGH6",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "LQy1qTPx35gOAX0yJfu0qOUXSY4iSCY43Pt4ICZnks1lAEuKOxt4ygJ+o3tcjANKF30FerLx7Le2WrsHzmhz7bcFcDGwZR4d6DEJBtFAcPYJ2VQeyjHmuPJ4S4bDWmYQFtlfPQac56HyWM8mGpcHb5wQzRK4qDFog8+CCoRdBLZqydtj0aYr2zbXnZjczBiN7asdSJCtOWm2kQTkiy64XAGpmYpiKPJRjg4MWvLCUf3oQx4BIBTL/1q3I2G/kau9kKaBcWeBTopJKeMwzjOID6J0YswR0cmbOnrleKTDvhwfBfemQ8dEq3niv/a7VbVFUkYaCzpVr/TEn3rYiBDwBw=="
    }

    response = requests.delete(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

# this test is used for testing delting an non existing registration code
def test_del_code_non_existing(api_url):
    data = {
        "email": "qc815@nyu.edu",
        "code": "non-existing",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "pvQzpBQR6zw1HOE3sgXGiSZpuofgZj0F61fIfF8kZ0FbnRyomCl8jhmMC3RRbO3+scHSKbfoJxfbEeO8v/BgzRUF96MThfq2/f4i+BKC0HCzcivE+u6O5XLrWNW2lW/PylwPJuG1skzdHASZvD3ftRb6YKhLZok7SWSzvPQSl3G53LtSoUvxE6UYapDjR1gabMvU4FpTkyiuCSAYhA2iHguX28Kf59jOlgwp+IKeZa8ZMI6XcnlbzcbnQn/8ctnSv7BBebwuQHjScBkvYoL1c31OBm9rM4wgxBv1A0QGT2JW271rY73aMe+8oYTRabY+bqRpzJb9lSsrOEaPTh2rHA=="
    }

    response = requests.delete(api_url, json=data, headers=headers)

    # response should not be successful
    assert response.status_code != 200

