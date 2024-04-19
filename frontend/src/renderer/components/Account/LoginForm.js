import styles from './RegisterForm.module.scss';

import Form from '../UI/Form';
import { useState } from 'react';
import { login } from '../../api/account';

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
    const [account_type, set_account_type] = useState(
        props.account_type || 'physician',
    );

    const onSubmit = async (form) => {
        await login(account_type, form.Email);
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
