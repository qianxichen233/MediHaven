import requests
import pytest

from datetime import datetime

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/schedule'

# this test is used for testing adding a new schedule
def test_add_schedule(api_url):
    data = {
        "patient_ID": 3,
        "physician_ID": 1,
        "schedule_st": "2024-03-25 13:10:00",
        "schedule_ed": "2024-03-25 13:40:00",
        "created_at": "2024-03-24 13:10:00",
        "description": "talking about diseases in my code",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-24 13:10:00"
    }

    headers = {
        "X-Signature": "C7p9otRcQbVPqrSkDltSgx9SFi7IlaS2FqcfATTm3AXS08QNQrQFY2FP4NFJBxwaAzLhTzi8S58jjq+m06EbWTiqAgpph6PZbh8PbGCH3tAH397zos7I31/FhlE9XGvPfueASBlSFxdPwIaW5NkMPqCanf9VXEs7HxjVOmCpXw2IhbFQKG7W02QzL9i64VpQFCek1xs3ogodgFrkeCm27kFIwm4G+E8wi2wg1HeFNFI6vYutBAOmAl/2oaHPGEsnkuCmAr3vW3J3i3uUH5ddy8kXRhcEjXmz6O34QPXOdTpGbhquh887/6Rhx5HND+OnyAOFXw/9f7otws/j+Z9Ajw=="
    }

    response = requests.put(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "patient_ID": 3,
        "physician_ID": 1,
        "schedule_st": "2024-03-25 13:40:00",
        "schedule_ed": "2024-03-25 14:40:00",
        "created_at": "2024-03-24 13:00:00",
        "description": "this is the description",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-24 13:10:00"
    }

    headers = {
        "X-Signature": "fUP4SNW691c3x3GvElkn9ITPtrGDIeuirVTzd7GHdXQ27xpV42KnZclDvZ7osc2PrKYUmphzseCxmsqjqtKgY7MLkLNx/xiP7Vm5JpfKWvMBXVH23K0s+qnVOK8JZqsxozFvmF+TIsnAXNJo9oD/Ml82BmUsTllgeobRvHpnHomCHClXSwu2CGaVlF+9JMZY1Saln5z++2i3X6K0gcBmMAvmHdQlaU4Moe1MRR/Sg1/bWzZBVoGZNBUK2QuhQ+p0aVPpQ4XTOFH7NQQ6hLiyrR5txlAEA8nfcl2ogVMER5LmA50UhqX9ABfe0tNPJ27CakU5LY+9+/UoS8XrLXbWsQ=="
    }

    response = requests.put(api_url, json=data, headers=headers)

    # response should be successful
    assert response.status_code == 200

# this test is used for testing adding a new schedule with invalid signature
def test_add_schedule_invalid_signature(api_url):
    data = {
        "patient_ID": 3,
        "physician_ID": 1,
        "schedule_st": "2024-03-25 13:10:00",
        "schedule_ed": "2024-03-25 13:40:00",
        "created_at": "2024-03-24 13:10:00",
        "description": "talking about diseases in my code",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-24 13:10:00"
    }

    headers = {
        "X-Signature": "invalid"
    }

    response = requests.put(api_url, json=data, headers=headers)

    # response should not be successful
    assert response.status_code != 200

# this test is used for testing getting the schedule
def test_get_schedule(api_url):
    params = {
        'email': 'qc815@nyu.edu',
        "timestamp_st": "2024-03-25 8:00:00",
        "timestamp_ed": "2024-03-25 16:00:00",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "m/jFAevY143PMKNV9TRaBEMDbQ2d9driUFU9bQkZInr4pNowwDQVS4vgCC/S9mBBdiYopEqrLcJn7GpRs54/MAFsW7NFvv57QcR7nycv+M9aA5uRZkMmz7Y9hS/xmxQ8fPoFRFTOMvb7wZwAi8950g9maHCUBB+u/nzhd/KEcRRJX1O/5lFAEDxpJXZLTGhUauuY2Ru79hPwvF0fiR81WlTq1GNLlpq5CB7AvoPKdHdEXetdgp2vovcscfUyZXyUJ1/nmhokwEaJpYcOkVC0Wi1/PxGGyyjTE3dOl9cOQcOoJnemCHU5/4Bf4/hVDz2FWplY/yYnBtroX2YMIiT3tA=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["schedules"]

    # should have at least one code
    assert len(content) != 0

    start_time = datetime.strptime("2024-03-25 8:00:00", '%Y-%m-%d %H:%M:%S')
    end_time = datetime.strptime("2024-03-25 16:00:00", '%Y-%m-%d %H:%M:%S')

    for schedule in content:
        # patient id should match
        schedule_st = datetime.strptime(schedule["schedule_st"], '%Y-%m-%d %H:%M:%S')

        # schedule start timestamp should be within the range
        assert start_time <= schedule_st <= end_time

    # try another one
    params = {
        'email': 'qc815@nyu.edu',
        "timestamp_st": "2024-03-25 00:00:00",
        "timestamp_ed": "2024-03-25 23:59:59",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "o0MWBznKy4a5A0Uku1n6RyPzvPsFCpVpmIOGqHAsaw1kEoLsk1tuM9fSF8D6rz3OzvjoyjIIMW4obqIIoLCsGRl8ZNwCzEya7U8daga9ph0QxYcvIfTPB/eQtKxWtrR9R12SPYi9EjycTUF9e0ySn+mqwYwexiq7jWTJARGxqBaUOL5edCWCIxIEgNcI3gv1aoBr9gebFYWC8lS3mSkyNWf6Rc7fR5UBsvHuTGurdBlUZQOUqqiUG47mU9dagR/fnQut3A9YQnAyaniGensqS881bMfnpzCWA64ekQSPyG4kM68+MhcMtirVY59S4VdXn1IevEYTCx2pvAhyG1NFBg=="
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should be successful
    assert response.status_code == 200

    content = response.json()["schedules"]

    # should have at least one code
    assert len(content) != 0

    start_time = datetime.strptime("2024-03-25 00:00:00", '%Y-%m-%d %H:%M:%S')
    end_time = datetime.strptime("2024-03-25 23:59:59", '%Y-%m-%d %H:%M:%S')

    for schedule in content:
        # patient id should match
        schedule_st = datetime.strptime(schedule["schedule_st"], '%Y-%m-%d %H:%M:%S')

        # schedule start timestamp should be within the range
        assert start_time <= schedule_st <= end_time

# this test is used for testing getting the schedule with invalid signature
def test_get_schedule_invalid_signature(api_url):
    params = {
        'email': 'qc815@nyu.edu',
        "timestamp_st": "2024-03-25 8:00:00",
        "timestamp_ed": "2024-03-25 16:00:00",
        "issuer_email": "qc815@nyu.edu",
        "timestamp": "2024-03-25 20:10:00"
    }

    headers = {
        "X-Signature": "invalid"
    }

    response = requests.get(api_url, params=params, headers=headers)

    # response should not be successful
    assert response.status_code != 200


