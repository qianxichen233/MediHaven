import styles from './RegisterForm.module.scss';

import Form from '../UI/Form';
import { useState } from 'react';
import { register } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import { AdminIcon, PhysicianIcon, ReceptionistIcon } from '../UI/Icon';

const departments = [
    'Internal Medicine',
    'Pediatrics',
    'Obstetrics and Gynecology (OB/GYN)',
    'Surgery',
    'Anesthesiology',
    'Emergency Medicine',
    'Radiology',
    'Orthopedics',
    'Neurology',
    'Cardiology',
    'Oncology',
    'Dermatology',
    'Psychiatry',
    'Ophthalmology',
    'Urology',
    'Pulmonology',
    'Endocrinology',
    'Gastroenterology',
    'Nephrology',
    'Infectious Diseases',
];

const inputFields = {
    administrator: {
        Code: 'text',
        'First Name': 'text',
        'Last Name': 'text',
        Sex: {
            type: 'list',
            content: ['Male', 'Female'],
        },
        Age: 'number',
        'Date of Birth': 'date',
        'Phone Number': 'text',
        Email: 'text',
        // 'Generate Key Pair?': 'checkbox',
    },
    physician: {
        Code: 'text',
        'First Name': 'text',
        'Last Name': 'text',
        Sex: {
            type: 'list',
            content: ['Male', 'Female'],
        },
        'Date of Birth': 'date',
        'Phone Number': 'text',
        Email: 'text',
        Title: 'text',
        Department: {
            type: 'list',
            content: departments,
        },
        // 'Generate Key Pair?': 'checkbox',
    },
    receptionist: {
        Code: 'text',
        'First Name': 'text',
        'Last Name': 'text',
        Sex: {
            type: 'list',
            content: ['Male', 'Female'],
        },
        Age: 'number',
        'Date of Birth': 'date',
        'Phone Number': 'text',
        Email: 'text',
        // 'Generate Key Pair?': 'checkbox',
    },
};

const RegisterForm = (props) => {
    const navigate = useNavigate();

    const [account_type, set_account_type] = useState(
        props.account_type || 'physician',
    );

    const [message, setMessage] = useState('');

    const onSubmit = async (form) => {
        console.log(form);
        const result = await register(account_type, form);
        console.log(result);
        if (result) {
            setMessage('register successfully!');
            setTimeout(() => {
                navigate('/account', { state: { action: 'login' } });
            }, 3000);
        }
        // console.log(form);
    };

    return (
        <div className={styles.container}>
            <Form
                title="REGISTER"
                content={inputFields[account_type]}
                onSubmit={onSubmit}
                column={2}
            ></Form>
            {/* <div className={styles.bookmarks}>
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
            </div> */}
            <div className={styles.menu}>
                <div
                    className={`${styles.item} ${
                        account_type === 'administrator' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'administrator')}
                >
                    <div>
                        <AdminIcon height={'30px'} width={'30px'} />
                    </div>
                    <span>admin</span>
                </div>
                <div
                    className={`${styles.item} ${
                        account_type === 'physician' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'physician')}
                >
                    <div>
                        <PhysicianIcon height={'30px'} width={'30px'} />
                    </div>
                    <span>physician</span>
                </div>
                <div
                    className={`${styles.item} ${
                        account_type === 'receptionist' ? styles.active : ''
                    }`}
                    onClick={set_account_type.bind(this, 'receptionist')}
                >
                    <div>
                        <ReceptionistIcon height={'30px'} width={'30px'} />
                    </div>
                    <span>receptionist</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
