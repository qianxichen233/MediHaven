import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './ChatBox.module.scss';
import { useMyContext } from '../MyContext';
import { OptionIcon } from '../UI/Icon';
import Select from '../UI/Select';
import MainButton from '../UI/MainButton';
import { decodeMessage, encodeMessage } from '../../utils/utils';
import NewChatModal from './NewChatModal';

const parse_key = (key) => {
    if (!key)
        return {
            role: null,
            email: null,
        };

    const index = key.indexOf('_');

    return {
        role: key.slice(0, index),
        email: key.slice(index + 1),
    };
};

const ChatBox = (props) => {
    const { user, setUser } = useMyContext();

    const [selected, setSelected] = useState();
    const chatBoxRef = useRef();

    const [newMessage, setNewMessage] = useState({
        role: '',
        email: '',
        type: 'message',
        message: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const scrollToBottom = () => {
        if (!chatBoxRef.current) return;
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    };

    useEffect(() => {
        setUser((user) => {
            return {
                ...user,
                update: false,
            };
        });
        scrollToBottom();
    }, [user.update]);

    useEffect(() => {
        if (!chatBoxRef.current) return;
        scrollToBottom();
    }, [chatBoxRef.current]);

    // console.log(user.messages.getMessages());

    const onMessageChange = (key, content) => {
        setNewMessage((message) => {
            return {
                ...message,
                [key]: content,
            };
        });
    };

    const onSelectChange = (user) => {
        if (user === selected) return;

        setSelected(user);

        const { role, email } = parse_key(user);
        setNewMessage({
            role: role,
            email: email,
            type: 'message',
            message: '',
        });
        chatBoxRef.current = null;
    };

    const { role, email } = parse_key(selected);

    const onMessageSend = async () => {
        console.log(newMessage);

        if (!newMessage.message) return;

        const encoded = encodeMessage(newMessage.type, newMessage.message);

        await window.electron.ipcRenderer.invoke('send', [
            newMessage.role.toLowerCase(),
            newMessage.email,
            encoded,
        ]);

        setNewMessage({
            role: role,
            email: email,
            type: 'message',
            message: '',
        });

        setUser((user) => {
            user.messages.addMessage(role, email, {
                ...decodeMessage(encoded),
                send: 1,
            });
            return user;
        });

        scrollToBottom();
    };

    const onAddNewChat = (inputs) => {
        setUser((user) => {
            user.messages.addMessage(
                inputs.role.toLowerCase(),
                inputs.email,
                null,
            );
            return {
                ...user,
                update: true,
            };
        });
        console.log(inputs);
    };

    // console.log(newMessage);

    return (
        <div className={styles.chatbox}>
            <div>
                <div>
                    {Object.keys(user.messages.getMessages()).map((sender) => {
                        const { role, email } = parse_key(sender);

                        return (
                            <div
                                key={sender}
                                onClick={onSelectChange.bind(this, sender)}
                                className={
                                    selected === sender ? styles.active : ''
                                }
                            >
                                <span>{email}</span>
                                <span>{role}</span>
                            </div>
                        );
                    })}
                </div>
                <div onClick={setIsModalOpen.bind(this, true)}>
                    <span>Add New Chat</span>
                </div>
            </div>
            <div>
                {!selected ? (
                    <div className={styles.empty}>
                        <span>MEDIHAVEN</span>
                    </div>
                ) : (
                    <>
                        <div>
                            <header>
                                <div>
                                    <span>{email}</span>
                                    <span>{role}</span>
                                </div>
                                <div>
                                    <OptionIcon height="30px" width="40px" />
                                </div>
                            </header>
                            <div className={styles.messageBox} ref={chatBoxRef}>
                                {user.messages
                                    .getMessages(selected)
                                    .map((message, index, array) => {
                                        const printTime =
                                            index === 0 ||
                                            Math.abs(
                                                new Date(message.timestamp) -
                                                    new Date(
                                                        array[
                                                            index - 1
                                                        ].timestamp,
                                                    ),
                                            ) >
                                                5 * 60 * 1000;
                                        return (
                                            <Fragment key={index}>
                                                {printTime && (
                                                    <span
                                                        className={styles.time}
                                                    >
                                                        {message.timestamp}
                                                    </span>
                                                )}
                                                <div
                                                    className={
                                                        message.send
                                                            ? styles.me
                                                            : styles.peer
                                                    }
                                                >
                                                    <div>
                                                        <span
                                                            className={
                                                                message.type ===
                                                                'message'
                                                                    ? ''
                                                                    : message.type ===
                                                                      'emergency'
                                                                    ? styles.emergency
                                                                    : styles.notification
                                                            }
                                                        >
                                                            {message.message}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className={styles.chatInput}>
                            <div className={styles.input}>
                                <textarea
                                    value={newMessage.message}
                                    onChange={(e) =>
                                        onMessageChange(
                                            'message',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Type your message here..."
                                />
                            </div>
                            <div className={styles.buttons}>
                                <Select
                                    label="Type"
                                    content={newMessage.type}
                                    setContent={onMessageChange.bind(
                                        this,
                                        'type',
                                    )}
                                    width="250px"
                                    height="40px"
                                    size="24px"
                                    list={[
                                        'message',
                                        'emergency',
                                        'notification',
                                    ]}
                                    noAny={true}
                                />
                                <MainButton
                                    background={
                                        !!newMessage.message
                                            ? 'var(--primary-button)'
                                            : '#e0e0e0'
                                    }
                                    color="white"
                                    text="SEND"
                                    width="200px"
                                    height="40px"
                                    onClick={onMessageSend}
                                    disabled={!newMessage.message}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <NewChatModal
                isOpen={isModalOpen}
                onConfirm={onAddNewChat}
                setIsOpen={setIsModalOpen}
            />
        </div>
    );
};

export default ChatBox;
