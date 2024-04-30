import { useEffect, useState } from 'react';
import styles from './Code.module.scss';

import { add_code, del_code, get_code } from '../../../api/code';
import { useMyContext } from '../../MyContext';
import MainButton from '../../UI/MainButton';
import Select from '../../UI/Select';
import Modal from 'react-modal';

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

const Code = (props) => {
    const { user } = useMyContext();

    const [codes, setCodes] = useState([]);
    const [isModalOpen, SetIsModalOpen] = useState(false);

    const [tokenType, setTokenType] = useState('Administrator');

    const [selected, setSelected] = useState(null);

    const getCodes = async () => {
        const result = await get_code(user.email);
        setSelected(null);
        setCodes(result);
    };

    useEffect(() => {
        getCodes();
    }, []);

    const toggleSelect = (index) => {
        let newstate;

        if (selected === null) newstate = Array(codes.length).fill(false);
        else newstate = [...selected];
        newstate[index] = !newstate[index];

        if (!newstate.some((value) => value === true)) setSelected(null);
        else setSelected(newstate);
    };

    const addCode = async () => {
        const type =
            tokenType === 'Administrator'
                ? 'admin'
                : tokenType === 'Physician'
                ? 'physician'
                : 'receptionist';
        const result = await add_code({
            email: user.email,
            account_type: type,
        });

        getCodes();
        onModalClose();
    };

    const onAdd = () => {
        SetIsModalOpen(true);
    };

    const onModalClose = () => {
        SetIsModalOpen(false);
        setTokenType('Administrator');
    };

    const onDelete = async () => {
        for (let i = 0; i < codes.length; ++i) {
            if (!selected[i]) continue;
            console.log(await del_code(user.email, codes[i].code));
        }
        getCodes();
    };

    return (
        <div className={styles.container}>
            <div className={styles.codes}>
                <header>
                    <span>Token</span>
                    <span>Account Type</span>
                    <span>Expiration Date</span>
                </header>
                {codes.map((code, index) => {
                    return (
                        <div key={code.code}>
                            <input
                                type="checkbox"
                                checked={selected && selected[index]}
                                onChange={toggleSelect.bind(this, index)}
                            />
                            <span>{code.code}</span>
                            <span>
                                {code.account_type === 'admin'
                                    ? 'Administrator'
                                    : code.account_type === 'physician'
                                    ? 'Physician'
                                    : 'Receptionist'}
                            </span>
                            <span>{code.expiration_date}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.buttons}>
                <MainButton
                    background="var(--primary-button)"
                    color="white"
                    text="Request New Token"
                    width="200px"
                    height="40px"
                    onClick={onAdd}
                />
                <MainButton
                    background={
                        selected !== null
                            ? 'var(--secondary-button)'
                            : '#e0e0e0'
                    }
                    color="white"
                    text="Delete Token"
                    width="150px"
                    height="40px"
                    onClick={onDelete}
                    disabled={selected === null}
                />
            </div>
            <Modal isOpen={isModalOpen} style={modalStyle} ariaHideApp={false}>
                <div className={styles.modal}>
                    <div className={styles.input}>
                        <span>Add New Token</span>
                        <Select
                            label="Select Account Type"
                            content={tokenType}
                            setContent={setTokenType}
                            size="24px"
                            width="200px"
                            height="50px"
                            list={[
                                'Administrator',
                                'Physician',
                                'Receptionist',
                            ]}
                            noAny={true}
                        />
                    </div>
                    <div className={styles.modalButtons}>
                        <MainButton
                            background="var(--primary-button)"
                            color="white"
                            text="CONFIRM"
                            width="150px"
                            height="40px"
                            onClick={addCode}
                        />
                        <MainButton
                            background="var(--secondary-button)"
                            color="white"
                            text="CANCEL"
                            width="150px"
                            height="40px"
                            onClick={onModalClose}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Code;
