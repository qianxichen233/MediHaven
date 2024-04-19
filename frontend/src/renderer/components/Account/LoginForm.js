import styles from './RegisterForm.module.scss';

import Form from '../UI/Form';
import { useState } from 'react';
import { login } from '../../api/account';
import { useNavigate } from 'react-router-dom';

const inputFields = {
    administrator: {
        Email: 'text',
    },
    physician: {
        Email: 'text',
    },
    receptionist: {
        Email: 'text',
    },
};

const LoginForm = (props) => {
    const navigate = useNavigate();

    const [account_type, set_account_type] = useState(
        props.account_type || 'physician',
    );

    const onSubmit = async (form) => {
        const result = await login(account_type, form.Email);
        if (result) {
            await window.electron.ipcRenderer.invoke('connect', [
                account_type,
                form.Email,
            ]);
            navigate('/main', { state: { type: account_type } });
        }
        // console.log(form);
    };

    return (
        <div className={styles.container}>
            <Form
                title="LOGIN"
                content={inputFields[account_type]}
                onSubmit={onSubmit}
                column={1}
            ></Form>
            <div className={styles.bookmarks}>
                <div
                    className={`${styles.bookmark} ${
                        account_type === 'administrator' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'administrator')}
                >
                    admin
                </div>
                <div
                    className={`${styles.bookmark} ${
                        account_type === 'physician' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'physician')}
                >
                    physician
                </div>
                <div
                    className={`${styles.bookmark} ${
                        account_type === 'receptionist' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'receptionist')}
                >
                    receptionist
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
