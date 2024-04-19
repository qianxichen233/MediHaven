import { getCurrentTime } from '../utils/utils';

const add_patient = async (data) => {
    const form = {};

    form['SSN'] = data['SSN'];
    form['First_Name'] = data['First_Name'];
    form['Last_Name'] = data['Last_Name'];
    form['Sex'] = data['Sex'];
    form['Date_Of_Birth'] = data['Date_Of_Birth'];
    form['Phone_Number'] = data['Phone_Number'];
    form['Email'] = data['Email'];
    form['Insurance_ID'] = data['Insurance_ID'];

    form['issuer_email'] = data['email'];
    form['timestamp'] = getCurrentTime();

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'POST patient',
            SSN: form['SSN'],
            First_Name: form['First_Name'],
            Last_Name: form['Last_Name'],
            Sex: req.form['Sex'],
            Date_Of_Birth: form['Date_Of_Birth'],
            Phone_Number: form['Phone_Number'],
            Email: form['Email'],
            Insurance_ID: form['Insurance_ID'],
            issuer_email: form['issuer_email'],
            timestamp: form['timestamp'],
        },
        'receptionist',
        form['Email'],
    ]);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/patient', {
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
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const get_patient = async (SSN, type, email) => {
    const timestamp = getCurrentTime();

    const params = new URLSearchParams({
        SSN: SSN,
        timestamp: timestamp,
        issuer_email: email,
    });

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'GET patient',
            SSN: SSN,
            issuer_email: email,
            timestamp: timestamp,
        },
        type,
        email,
    ]);

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/patient?${params}`,
            {
                method: 'GET',
                headers: {
                    'X-Signature': signature,
                },
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const get_record = async (id, email) => {
    const timestamp = getCurrentTime();

    const params = new URLSearchParams({
        patient_id: id,
        timestamp: timestamp,
        issuer_email: email,
    });

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'GET record',
            patient_id: id,
            issuer_email: email,
            timestamp: timestamp,
        },
        'physician',
        email,
    ]);

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/record?${params}`,
            {
                method: 'GET',
                headers: {
                    'X-Signature': signature,
                },
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export { add_patient, get_patient, get_record };
