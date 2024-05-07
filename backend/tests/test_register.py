import requests
import pytest

@pytest.fixture
def api_url():
    return 'http://127.0.0.1:5000/api/register'

# this test is used for test registering a new admin
def test_admin_register(api_url):
    data = {
        "Code": "dev",
        "Account_Type": "admin",
        "First_Name": "Qianxi",
        "Last_Name": "Chen",
        "Sex": "Male",
        "Age": "99",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB",
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "Code": "dev",
        "Account_Type": "admin",
        "First_Name": "Alex",
        "Last_Name": "Yan",
        "Sex": "Male",
        "Age": "18",
        "Date_Of_Birth": "2000-01-01",
        "Phone_Number": "123-456-7890",
        "Email": "xy2089@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB",
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    data = {
        "Code": "dev",
        "Account_Type": "admin",
        "First_Name": "Qianxi",
        "Last_Name": "Chen",
        "Sex": "Male",
        "Age": "99",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB",
    }

    response = requests.post(api_url, json=data)

    # account with same email is not allowed
    # so response should not be successful
    assert response.status_code != 200


# this test is used for test registering a new physician
def test_physician_register(api_url):
    data = {
        "Code": "dev",
        "Account_Type": "physician",
        "First_Name": "Qianxi",
        "Last_Name": "Chen",
        "Sex": "Male",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Title": "Fellow",
        "Department": "Nephrology",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "Code": "dev",
        "Account_Type": "physician",
        "First_Name": "Alex",
        "Last_Name": "Yan",
        "Sex": "Male",
        "Date_Of_Birth": "2000-01-01",
        "Phone_Number": "123-456-7890",
        "Email": "xy2089@nyu.edu",
        "Title": "Fellow",
        "Department": "Nephrology",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    data = {
        "Code": "dev",
        "Account_Type": "physician",
        "First_Name": "Alex",
        "Last_Name": "Yan",
        "Sex": "Male",
        "Date_Of_Birth": "2000-01-01",
        "Phone_Number": "123-456-7890",
        "Email": "xy2089@nyu.edu",
        "Title": "Fellow",
        "Department": "Nephrology",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # account with same email is not allowed
    # so response should not be successful
    assert response.status_code != 200

# this test is used for test registering a new receptionist
def test_receptionist_register(api_url):
    data = {
        "Code": "dev",
        "Account_Type": "receptionist",
        "First_Name": "Qianxi",
        "Last_Name": "Chen",
        "Sex": "Male",
        "Date_Of_Birth": "1970-12-31",
        "Phone_Number": "123-456-7890",
        "Email": "qc815@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    # try another one
    data = {
        "Code": "dev",
        "Account_Type": "receptionist",
        "First_Name": "Alex",
        "Last_Name": "Yan",
        "Sex": "Male",
        "Date_Of_Birth": "2000-01-01",
        "Phone_Number": "123-456-7890",
        "Email": "xy2089@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # response should be successful
    assert response.status_code == 200

    data = {
        "Code": "dev",
        "Account_Type": "receptionist",
        "First_Name": "Alex",
        "Last_Name": "Yan",
        "Sex": "Male",
        "Date_Of_Birth": "2000-01-01",
        "Phone_Number": "123-456-7890",
        "Email": "xy2089@nyu.edu",
        "Pub_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwBEj4UWvxtQhO9+/z56qjSJO+K9htAOx2Y136wkEiEq1ord+6hywnF6RCxdddg+y1UMRUH6nL7ZB4ajvrtxPqHsGECGNsKLANKy/lNklMKxjElp98gvOtfBhiafBDJpX0X2XUkMGBQjV6ipiu0uDD8Qh2FOVz/SyVAQ7p1I9mKMk2XDm/7SddkJJWcVI44uO8lJ5SeQC/WDbb9JBZbRfQ2bMRFJ6pKd3VkBb18jLlfDZGnSCFG38VUBYMQmJnUmp7I+QfLgrXP4ZDTfInFDfdbJf4YOkkbe7ESr+xQkZxTovMa77WFIATh4zpo686mUCl0X+Qk1usIHX3agiFT+1lQIDAQAB"
    }

    response = requests.post(api_url, json=data)

    # account with same email is not allowed
    # so response should not be successful
    assert response.status_code != 200



