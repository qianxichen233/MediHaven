import { getCurrentTime } from '../utils/utils';

const add_code = async (data) => {
    const form = {};

    form['email'] = data['email'];
    form['account_type'] = data['account_type'];

    form['timestamp'] = getCurrentTime();

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'POST code',
            email: form['email'],
            account_type: form['account_type'],
            timestamp: form['timestamp'],
        },
        'admin',
        form['email'],
    ]);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const get_code = async (email) => {
    const timestamp = getCurrentTime();

    const params = new URLSearchParams({
        email: email,
        timestamp: timestamp,
    });

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'GET code',
            email: email,
            timestamp: timestamp,
        },
        'admin',
        email,
    ]);

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/code?${params}`,
            {
                method: 'GET',
                headers: {
                    'X-Signature': signature,
                },
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData.codes;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const del_code = async (email, code) => {
    const form = {};

    form['email'] = email;
    form['code'] = code;

    form['timestamp'] = getCurrentTime();

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'DELETE code',
            email: email,
            code: code,
            timestamp: form['timestamp'],
        },
        'admin',
        email,
    ]);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/code', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export { add_code, get_code, del_code };
