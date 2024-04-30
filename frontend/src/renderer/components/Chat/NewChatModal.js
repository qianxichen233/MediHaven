import { useState } from 'react';
import styles from '../Main/Subpages/Messages.module.scss';

import Modal from 'react-modal';
import Select from '../UI/Select';
import Input from '../UI/Input';
import MainButton from '../UI/MainButton';

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

const NewChatModal = ({ onConfirm, isOpen, setIsOpen }) => {
    const [inputs, setInputs] = useState({
        role: 'Admin',
        email: '',
    });

    const onInputsChange = (key, value) => {
        setInputs((inputs) => {
            return {
                ...inputs,
                [key]: value,
            };
        });
    };

    const onClickHandler = () => {
        onConfirm(inputs);
        setIsOpen(false);
    };

    return (
        <Modal isOpen={isOpen} style={modalStyle} ariaHideApp={false}>
            <div className={styles.modal}>
                <span>New Chat</span>
                <div className={styles.inputs}>
                    <div>
                        <Select
                            label="Role"
                            content={inputs.role}
                            setContent={onInputsChange.bind(this, 'role')}
                            width="150px"
                            height="40px"
                            size="24px"
                            list={['Admin', 'Physician', 'Receptionist']}
                            noAny={true}
                        />
                        <Input
                            label="Email"
                            content={inputs.email}
                            setContent={onInputsChange.bind(this, 'email')}
                            width="150px"
                            height="40px"
                            size="24px"
                        />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <MainButton
                        background={
                            !!inputs.email ? 'var(--primary-button)' : '#e0e0e0'
                        }
                        color="white"
                        text="ADD"
                        width="200px"
                        height="40px"
                        onClick={onClickHandler}
                        disabled={!inputs.email}
                    />

                    <MainButton
                        background="var(--secondary-button)"
                        color="white"
                        text="CANCEL"
                        width="200px"
                        height="40px"
                        onClick={setIsOpen.bind(this, false)}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default NewChatModal;
