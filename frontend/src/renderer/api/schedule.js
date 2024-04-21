import { getCurrentTime } from '../utils/utils';

const add_schedule = async (data) => {
    const form = {};

    form['patient_ID'] = data['patient_ID'];
    form['physician_ID'] = data['physician_ID'];
    form['schedule_st'] = data['schedule_st'];
    form['schedule_ed'] = data['schedule_ed'];
    form['created_at'] = getCurrentTime();
    form['description'] = data['description'];

    form['issuer_email'] = data['email'];
    form['timestamp'] = getCurrentTime();

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'PUT schedule',
            patient_ID: form['patient_ID'],
            physician_ID: form['physician_ID'],
            schedule_st: form['schedule_st'],
            schedule_ed: form['schedule_ed'],
            created_at: form['created_at'],
            description: form['description'],
            issuer_email: form['issuer_email'],
            timestamp: form['timestamp'],
        },
        'receptionist',
        form['issuer_email'],
    ]);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/schedule', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === 'success!') return true;
            console.log('POST request successful:', data);
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return false;
};

const get_schedule = async (type, email, st, ed, issuer_email) => {
    const timestamp = getCurrentTime();

    const params = new URLSearchParams({
        email: email,
        timestamp_st: st,
        timestamp_ed: ed,
        timestamp: timestamp,
        issuer_email: issuer_email,
    });

    const signature = await window.electron.ipcRenderer.invoke('sign', [
        {
            endpoint: 'GET schedule',
            email: email,
            timestamp_st: st,
            timestamp_ed: ed,
            issuer_email: issuer_email,
            timestamp: timestamp,
        },
        type,
        email,
    ]);

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/schedule?${params}`,
            {
                method: 'GET',
                headers: {
                    'X-Signature': signature,
                },
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData.schedules;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export { add_schedule, get_schedule };
