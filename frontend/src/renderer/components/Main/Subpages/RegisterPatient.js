import { useState } from 'react';
import Input from '../../UI/Input';
import styles from './RegisterPatient.module.scss';
import Card from '../../UI/Card';
import MainButton from '../../UI/MainButton';
import { add_patient, get_patient } from '../../../api/patient';
import { useMyContext } from '../../MyContext';
import DateInput from '../../UI/DateInput';
import Select from '../../UI/Select';

const RegisterPatient = (props) => {
    const { user } = useMyContext();

    const [page, setPage] = useState('');

    const [info, setInfo] = useState({
        SSN: '',
        First_Name: '',
        Last_Name: '',
        Sex: 'Male',
        Date_Of_Birth: '',
        Phone_Number: '',
        Email: '',
        Insurance_ID: '1',
    });

    const [searchSSN, setSearchSSN] = useState('');
    const [found, setFound] = useState({
        active: false,
        found: false,
    });

    const onSearch = async () => {
        const patient_data = await get_patient(
            searchSSN,
            user.role,
            user.email,
        );

        setFound({
            active: true,
            found: !!patient_data,
        });
    };

    const onCancel = () => {
        setInfo({
            SSN: '',
            First_Name: '',
            Last_Name: '',
            Sex: 'Male',
            Date_Of_Birth: '',
            Phone_Number: '',
            Email: '',
            Insurance_ID: '1',
        });
        setPage('left');
        setSearchSSN('');
        setFound({
            active: false,
            found: false,
        });
    };

    const onSubmit = async () => {
        console.log(info);
        for (let key in info) {
            if (info[key] === '') return;
        }

        console.log('add patient');

        const result = await add_patient({
            ...info,
            issuer_email: user.email,
        });
        if (result) onCancel();
    };

    const onChange = (key, value) => {
        setInfo((info) => {
            return {
                ...info,
                [key]: value,
            };
        });
    };

    const onSwitchPage = (page) => {
        setPage(page);
    };

    const validSSN = /^\d{3}-\d{2}-\d{4}$/.test(searchSSN);

    return (
        <div className={styles.container}>
            <header>Add New Patient</header>
            <div>
                <div className={styles.left}>
                    <header>Search Patient</header>
                    <Input
                        label="SSN"
                        content={searchSSN}
                        setContent={setSearchSSN}
                        width="250px"
                        height="40px"
                        size="24px"
                    />
                    <MainButton
                        background={
                            validSSN
                                ? found.active
                                    ? 'orange'
                                    : 'var(--primary-button)'
                                : '#e0e0e0'
                        }
                        color="white"
                        text="SEARCH"
                        width="200px"
                        height="40px"
                        onClick={onSearch}
                        disabled={!validSSN}
                    />
                    {found.active &&
                        (!found.found ? (
                            <>
                                <span className={styles.notfound}>
                                    Patient Not Found
                                </span>
                                <MainButton
                                    background="var(--primary-button)"
                                    color="white"
                                    text="ADD PATIENT"
                                    width="200px"
                                    height="40px"
                                    onClick={onSwitchPage.bind(this, 'right')}
                                />
                            </>
                        ) : (
                            <span className={styles.found}>Patient Exist</span>
                        ))}
                </div>
                <div className={styles.right}>
                    <div>
                        <div>
                            <label>SSN</label>
                            <Input
                                label=""
                                content={info.SSN}
                                setContent={onChange.bind(this, 'SSN')}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <label>First Name</label>
                            <Input
                                label=""
                                content={info.First_Name}
                                setContent={onChange.bind(this, 'First_Name')}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <Input
                                label=""
                                content={info.Last_Name}
                                setContent={onChange.bind(this, 'Last_Name')}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <Input
                                label=""
                                content={info.Phone_Number}
                                setContent={onChange.bind(this, 'Phone_Number')}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <label>Sex</label>
                            <Select
                                label=""
                                content={info.sex}
                                setContent={onChange.bind(this, 'Sex')}
                                width="250px"
                                height="40px"
                                size="24px"
                                list={['Male', 'Female']}
                                noAny={true}
                            />
                        </div>
                        <div>
                            <label>Date Of Birth</label>
                            <DateInput
                                label=""
                                content={info.Date_Of_Birth}
                                setContent={onChange.bind(
                                    this,
                                    'Date_Of_Birth',
                                )}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div>
                            <label>Email Address</label>
                            <Input
                                label=""
                                content={info.Email}
                                setContent={onChange.bind(this, 'Email')}
                                width="250px"
                                height="40px"
                                size="24px"
                            />
                        </div>
                        <div className={styles.buttons}>
                            <MainButton
                                background="var(--primary-button)"
                                color="white"
                                text="ADD PATIENT"
                                width="200px"
                                height="40px"
                                onClick={onSubmit}
                            />
                            <MainButton
                                background="var(--secondary-button)"
                                color="white"
                                text="CANCEL"
                                width="200px"
                                height="40px"
                                onClick={onCancel}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={`${styles.cover} ${
                        page === 'right'
                            ? styles.active
                            : page === 'left'
                            ? styles.deactive
                            : ''
                    }`}
                >
                    <span>MEDIHAVEN</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPatient;
