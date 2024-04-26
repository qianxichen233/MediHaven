import styles from './RegisterForm.module.scss';

import Form from '../UI/Form';
import { useState } from 'react';
import { login } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../MyContext';
import { decodeMessage, decodeSender } from '../../utils/utils';

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
    const { user, setUser } = useMyContext();

    const [account_type, set_account_type] = useState(
        props.account_type || 'physician',
    );

    const onSubmit = async (form) => {
        let type = account_type === 'administrator' ? 'admin' : account_type;

        const result = await login(type, form.Email);
        if (result) {
            const messages = (
                await window.electron.ipcRenderer.invoke('load_msg', [
                    type,
                    form.Email,
                ])
            ).map((message) => {
                const parsed = JSON.parse(message);
                const { role, email } = decodeSender(parsed.from);
                return {
                    role,
                    email,
                    ...decodeMessage(parsed.message),
                };
            });

            // console.log(`load from local db: ${messages}`);
            // window.electron.ipcRenderer.on('chat', (data) => {
            //     console.log(`inside renderer: ${JSON.stringify(data)}`);
            //     const { role, email } = decodeSender(data.message.from);

            //     setUser((user) => {
            //         const msg = [...user.messages];
            //         msg.push({
            //             role,
            //             email,
            //             ...decodeMessage(data.message.message),
            //         });
            //         return {
            //             ...user,
            //             messages: msg,
            //         };
            //     });
            // });

            await window.electron.ipcRenderer.invoke('connect', [
                type,
                form.Email,
            ]);

            setUser((user) => {
                return {
                    role: type,
                    email: form.Email,
                    messages: messages,
                };
            });
            navigate('/main', { state: { type: type } });
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
