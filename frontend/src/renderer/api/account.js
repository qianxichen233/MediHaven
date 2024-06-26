import { getAPI, getCurrentTime } from '../utils/utils';

const register = async (type, data) => {
    const account_type = type === 'administrator' ? 'admin' : type;

    const form = {};

    form['Code'] = data['Code'];
    form['First_Name'] = data['First Name'];
    form['Last_Name'] = data['Last Name'];
    form['Sex'] = data['Sex'];
    form['Date_Of_Birth'] = data['Date of Birth'];
    form['Phone_Number'] = data['Phone Number'];
    form['Email'] = data['Email'];

    form['Account_Type'] = account_type;

    if (account_type === 'admin' || account_type === 'receptionist') {
        form['Age'] = data['Age'];
    } else {
        form['Title'] = data['Title'];
        form['Department'] = data['Department'];
    }

    form['Pub_key'] = await window.electron.ipcRenderer.invoke('create_key', [
        account_type,
        form['Email'],
    ]);

    form['Password'] = await window.electron.ipcRenderer.invoke(
        'get_password',
        [account_type, form['Email']],
    );

    console.log(form);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('POST request successful:', data);
            if (data.message === 'success!') return true;
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
};

const login = async (type, email) => {
    const account_type = type === 'administrator' ? 'admin' : type;

    const form = {};
    form['account_type'] = account_type;
    form['email'] = email;
    form['timestamp'] = getCurrentTime();

    console.log(form);

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'POST login',
            email: email,
            timestamp: form['timestamp'],
        },
        account_type,
        email,
    ]);

    if (signature === null) {
        return false;
    }

    const baseAPI = await getAPI();

    try {
        const response = await fetch(`http://${baseAPI}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('POST request successful:', data);
            if (data.message === 'hacker') return 'hacker';
            if (data.message === 'success!') return true;
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return false;
};

export { register, login };
