import { useState } from 'react';
import Input from '../../UI/Input';
import styles from './RegisterPatient.module.scss';
import Card from '../../UI/Card';
import MainButton from '../../UI/MainButton';
import { add_patient } from '../../../api/patient';
import { useMyContext } from '../../MyContext';
import DateInput from '../../UI/DateInput';
import Select from '../../UI/Select';

const RegisterPatient = (props) => {
    const { user } = useMyContext();

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
        if (result)
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
    };

    const onChange = (key, value) => {
        setInfo((info) => {
            return {
                ...info,
                [key]: value,
            };
        });
    };

    return (
        <div className={styles.container}>
            <header>Add New Patient</header>
            <div>
                <Input
                    label="SSN"
                    content={info.SSN}
                    setContent={onChange.bind(this, 'SSN')}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <Input
                    label="First Name"
                    content={info.First_Name}
                    setContent={onChange.bind(this, 'First_Name')}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <Input
                    label="Last Name"
                    content={info.Last_Name}
                    setContent={onChange.bind(this, 'Last_Name')}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <Input
                    label="Phone Number"
                    content={info.Phone_Number}
                    setContent={onChange.bind(this, 'Phone_Number')}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <Select
                    label="Sex"
                    content={info.sex}
                    setContent={onChange.bind(this, 'Sex')}
                    width="250px"
                    height="40px"
                    size="24px"
                    list={['Male', 'Female']}
                    noAny={true}
                />
                <DateInput
                    label="Date Of Birth"
                    content={info.Date_Of_Birth}
                    setContent={onChange.bind(this, 'Date_Of_Birth')}
                    width="250px"
                    height="40px"
                    size="24px"
                />
                <Input
                    label="Email Address"
                    content={info.Email}
                    setContent={onChange.bind(this, 'Email')}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <MainButton
                    background="var(--primary-button)"
                    color="white"
                    text="ADD PATIENT"
                    width="200px"
                    height="40px"
                    onClick={onSubmit}
                />
            </div>
            {/* <Card /> */}
        </div>
    );
};

export default RegisterPatient;
