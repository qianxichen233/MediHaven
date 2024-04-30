import { useState } from 'react';
import styles from './Messages.module.scss';
import MessageList from '../../UI/MessageList';
import Button from '../../UI/Button';
import { useMyContext } from '../../MyContext';
import { encodeMessage } from '../../../utils/utils';
import Modal from 'react-modal';
import Select from '../../UI/Select';
import Input from '../../UI/Input';
import MainButton from '../../UI/MainButton';
import ChatBox from '../../Chat/ChatBox';

const test = [
    {
        from: 'alice',
        to: 'bob',
        type: 'message',
        date: '2024-4-16 12:31:12',
        status: 'unread',
    },
    {
        from: 'bob',
        to: 'alice',
        type: 'message',
        date: '2024-4-14 12:31:12',
        status: 'read',
    },
];

const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--main-bg-color)',
    },
    overlay: { zIndex: 1000 },
};

const Messages = (props) => {
    const { user } = useMyContext();

    // console.log(user.messages);

    const [selected, setSelected] = useState(
        new Array(test.length).fill(false),
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState({
        role: 'Admin',
        email: '',
        type: 'message',
        message: '',
    });

    const [viewMessage, setViewMessage] = useState(null);

    const onMessageChange = (key, content) => {
        setNewMessage((message) => {
            return {
                ...message,
                [key]: content,
            };
        });
    };

    const onSetect = (index) => {
        console.log(index);
        setSelected((prev) => {
            const new_select = [...prev];
            new_select[index] = !new_select[index];
            console.log(new_select);
            return new_select;
        });
    };

    const allowSend = !!newMessage.email && !!newMessage.message && isModalOpen;

    const onMessageSend = async () => {
        if (!allowSend) return;

        console.log(newMessage);

        await window.electron.ipcRenderer.invoke('send', [
            newMessage.role.toLowerCase(),
            newMessage.email,
            encodeMessage(newMessage.type, newMessage.message),
        ]);

        onModalClose();
    };

    const onModalClose = () => {
        setNewMessage({
            role: 'Admin',
            email: '',
            type: 'message',
            message: '',
        });
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            {/* <MessageList
                messages={user.messages}
                select={selected}
                onSelect={onSetect}
                onClick={setViewMessage}
            /> */}
            <ChatBox />
            {/* <div className={styles.buttons}>
                <button
                    style={{ backgroundColor: '#45e4ab' }}
                    onClick={setIsModalOpen.bind(this, true)}
                >
                    Add New
                </button>
                <button style={{ backgroundColor: '#F77' }}>Delete</button>
            </div>
            <Modal isOpen={isModalOpen} style={modalStyle} ariaHideApp={false}>
                <div className={styles.modal}>
                    <span>New Message</span>
                    <div className={styles.inputs}>
                        <div>
                            <Select
                                label="Role"
                                content={newMessage.role}
                                setContent={onMessageChange.bind(this, 'role')}
                                width="150px"
                                height="40px"
                                size="24px"
                                list={['Admin', 'Physician', 'Receptionist']}
                                noAny={true}
                            />
                            <Input
                                label="Email"
                                content={newMessage.email}
                                setContent={onMessageChange.bind(this, 'email')}
                                width="150px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <Select
                                label="Type"
                                content={newMessage.type}
                                setContent={onMessageChange.bind(this, 'type')}
                                width="250px"
                                height="40px"
                                size="24px"
                                list={['message', 'emergency', 'notice']}
                                noAny={true}
                            />
                        </div>
                        <div className={styles.messageInput}>
                            <label>Message: </label>
                            <textarea
                                rows={5}
                                value={newMessage.message}
                                onChange={(e) =>
                                    onMessageChange('message', e.target.value)
                                }
                                placeholder="Enter message here..."
                            />
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <MainButton
                            background={
                                allowSend ? 'var(--primary-button)' : '#e0e0e0'
                            }
                            color="white"
                            text="SEND"
                            width="200px"
                            height="40px"
                            onClick={onMessageSend}
                            disabled={!allowSend}
                        />

                        <MainButton
                            background="var(--secondary-button)"
                            color="white"
                            text="CANCEL"
                            width="200px"
                            height="40px"
                            onClick={onModalClose}
                        />
                    </div>
                </div>
            </Modal>
            {viewMessage !== null && (
                <Modal
                    isOpen={viewMessage !== null}
                    style={modalStyle}
                    ariaHideApp={false}
                >
                    {(() => {
                        let from = `${user.messages[viewMessage].email} (${user.messages[viewMessage].role})`;
                        let to = 'Me';

                        if (
                            user.messages[viewMessage].email === user.email &&
                            user.messages[viewMessage].role === user.role
                        ) {
                            let tmp = from;
                            from = to;
                            to = tmp;
                        }

                        return (
                            <div className={styles.message}>
                                <span>View Message</span>
                                <div className={styles.info}>
                                    <div>
                                        <span>Sender: </span>
                                        <span>{from}</span>
                                    </div>
                                    <div>
                                        <span>Reciever: </span>
                                        <span>{to}</span>
                                    </div>
                                    <div>
                                        <span>Type: </span>
                                        <span>
                                            {user.messages[viewMessage].type}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Time: </span>
                                        <span>
                                            {
                                                user.messages[viewMessage]
                                                    .timestamp
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span>Message: </span>
                                        <span>
                                            {user.messages[viewMessage].message}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.buttons}>
                                    <MainButton
                                        background="var(--secondary-button)"
                                        color="white"
                                        text="CANCEL"
                                        width="200px"
                                        height="40px"
                                        onClick={setViewMessage.bind(
                                            this,
                                            null,
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    })()}
                </Modal>
            )} */}
        </div>
    );
};

export default Messages;
