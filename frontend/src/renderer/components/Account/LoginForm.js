import styles from './RegisterForm.module.scss';

import Form from '../UI/Form';
import { useState } from 'react';
import { login } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../MyContext';
import { decodeMessage, decodeSender } from '../../utils/utils';
import { MessageQueue } from '../../utils/MessageQueue';
import { AdminIcon, PhysicianIcon, ReceptionistIcon } from '../UI/Icon';

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

    const [isHacker, setIsHacker] = useState(false);

    const [account_type, set_account_type] = useState(
        props.account_type || 'physician',
    );

    const onSubmit = async (form) => {
        let type = account_type === 'administrator' ? 'admin' : account_type;

        const result = await login(type, form.Email);
        if (result === 'hacker') {
            setIsHacker(true);
        } else if (result) {
            const messages = (
                await window.electron.ipcRenderer.invoke('load_msg', [
                    type,
                    form.Email,
                ])
            ).reduce((acc, message) => {
                const parsed = JSON.parse(message);
                const { role, email } = decodeSender(parsed.from);

                console.log(JSON.parse(parsed.message));

                acc.addMessage(role, email, JSON.parse(parsed.message));

                return acc;
            }, new MessageQueue());

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
                    update: true,
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
            {isHacker && (
                <div className={styles.hacker}>Get away, you damn hacker!</div>
            )}
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

export default LoginForm;
