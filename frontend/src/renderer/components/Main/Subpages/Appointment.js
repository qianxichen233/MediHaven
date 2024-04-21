import { useState } from 'react';
import styles from './Appointment.module.scss';
import { getCurrentDate } from '../../../utils/utils';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import DateInput from '../../UI/DateInput';
import MainButton from '../../UI/MainButton';
import { get_physicians } from '../../../api/physician';
import { add_schedule, get_schedule } from '../../../api/schedule';
import { useMyContext } from '../../MyContext';
import EditableSingleSchedule from '../../UI/EditableSingleSchedule';

import Modal from 'react-modal';
import { get_patient } from '../../../api/patient';

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
};

let errorTID = null;

const patientPage = (
    SSN,
    onChange,
    getPatient,
    error,
    patient,
    onNext,
    onCancel,
) => {
    return (
        <div className={styles.patientPage}>
            <div className={styles.patientInput}>
                <Input
                    label="Patient SSN"
                    content={SSN}
                    setContent={onChange}
                    width="250px"
                    height="40px"
                    size="24px"
                    layout="column"
                />
                <MainButton
                    background="var(--primary-color)"
                    color="white"
                    text="SEARCH"
                    width="200px"
                    height="40px"
                    onClick={getPatient}
                />
                {!!error && <span className={styles.error}>{error}</span>}
                {!!patient && (
                    <div className={styles.patient}>
                        <div>
                            <label>Name: </label>
                            <span>
                                {patient.First_Name} {patient.Last_Name}
                            </span>
                        </div>
                        <div>
                            <label>Sex: </label>
                            <span>{patient.Sex}</span>
                        </div>
                        <div>
                            <label>DOB: </label>
                            <span>{patient.Date_Of_Birth}</span>
                        </div>
                        <div>
                            <label>SSN: </label>
                            <span>{patient.SSN}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.modalButtons}>
                <MainButton
                    background={!!patient ? 'var(--primary-color)' : '#e0e0e0'}
                    color="white"
                    text="PROCEED"
                    width="150px"
                    height="40px"
                    onClick={onNext}
                    disabled={!patient}
                />
                <MainButton
                    background="var(--secondary-color)"
                    color="white"
                    text="CANCEL"
                    width="150px"
                    height="40px"
                    onClick={onCancel}
                />
            </div>
        </div>
    );
};

const infoPage = (
    date,
    st,
    ed,
    patient,
    physician,
    description,
    setDescription,
    onSubmit,
    onCancel,
    error,
) => {
    return (
        <div className={styles.infoPage}>
            <div className={styles.info}>
                <div>
                    <label>Physician: </label>
                    <span>
                        {physician.first_name + ' ' + physician.last_name}
                    </span>
                </div>
                <div>
                    <label>Patient: </label>
                    <span>{patient.First_Name + ' ' + patient.Last_Name}</span>
                </div>
                <div>
                    <label>Date: </label>
                    <span>{date}</span>
                </div>
                <div>
                    <label>Time: </label>
                    <span>
                        {st} - {ed}
                    </span>
                </div>
                <div className={styles.description}>
                    <label>Description: </label>
                    <textarea
                        rows={5}
                        cols={40}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description here..."
                    />
                </div>
                {!!error && <span className={styles.error}>{error}</span>}
            </div>
            <div className={styles.modalButtons}>
                <MainButton
                    background="var(--primary-color)"
                    color="white"
                    text="SUBMIT"
                    width="150px"
                    height="40px"
                    onClick={onSubmit}
                />
                <MainButton
                    background="var(--secondary-color)"
                    color="white"
                    text="CANCEL"
                    width="150px"
                    height="40px"
                    onClick={onCancel}
                />
            </div>
        </div>
    );
};

const Appointment = (props) => {
    const { user } = useMyContext();

    const [physicians, setPhysicians] = useState([]);
    const [selected, setSelected] = useState([]);

    const [date, setDate] = useState(getCurrentDate());
    const [scheduleInfo, setScheduleInfo] = useState({
        physician: null,
        st: '',
        ed: '',
    });

    const [name, setName] = useState('');
    const [department, setDepartment] = useState('Any');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [SSN, setSSN] = useState('');
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState('patient');

    const [description, setDescription] = useState('');

    const changeSelect = (index) => {
        const newstate = Array(selected.length).fill(false);
        if (!selected[index]) newstate[index] = true;
        setSelected(newstate);
    };

    const getSchedule = async (result) => {
        let physicians = [];

        for (const physician of result) {
            const schedule = await get_schedule(
                user.role,
                physician.email,
                date + ' 00:00:00',
                date + ' 23:59:00',
                user.email,
            );
            physicians.push({
                physician,
                schedule,
            });
        }

        setPhysicians(physicians);
        setSelected(Array(physicians.length).fill(false));

        console.log(physicians);
    };

    const onSearch = async () => {
        const result = await get_physicians(department, name);
        await getSchedule(result);
    };

    const onSelect = (index, st, ed) => {
        console.log(index, st, ed);
        setScheduleInfo({
            physician: physicians[index].physician,
            st,
            ed,
        });
        setSelected(index);
        setCurrentPage('patient');
        setIsModalOpen(true);
    };

    const getPatient = async () => {
        if (!/^\d{3}-\d{2}-\d{4}$/.test(SSN)) {
            if (errorTID) clearTimeout(errorTID);
            setError('Invalid SSN format');
            errorTID = setTimeout(() => {
                setError(null);
                errorTID = null;
            }, 3000);
            return;
        }

        const patient_data = await get_patient(SSN, user.role, user.email);

        if (patient_data === null) {
            if (errorTID) clearTimeout(errorTID);
            setError('Patient not found!');
            errorTID = setTimeout(() => {
                setError(null);
                errorTID = null;
            }, 3000);
        }

        if (errorTID) clearTimeout(errorTID);
        setError(null);

        setPatient(patient_data);
    };

    const onModalClose = () => {
        setPatient(null);
        setSSN('');
        setError(null);
        setIsModalOpen(false);
        setCurrentPage('patient');
        setDescription('');
        setScheduleInfo({
            physician: null,
            st: '',
            ed: '',
        });
    };

    const onNext = () => {
        setCurrentPage('info');
    };

    const onSubmit = async () => {
        const data = {
            patient_ID: patient.ID,
            physician_ID: scheduleInfo.physician.ID,
            schedule_st: date + ' ' + scheduleInfo.st + ':00',
            schedule_ed: date + ' ' + scheduleInfo.ed + ':00',
            description: description,
            email: user.email,
        };

        const result = await add_schedule(data);

        if (result) {
            const schedule = await get_schedule(
                user.role,
                scheduleInfo.physician.email,
                date + ' 00:00:00',
                date + ' 23:59:00',
                user.email,
            );
            setPhysicians((prev) => {
                let index = 0;
                for (; index < prev.length; ++index)
                    if (prev[index].physician.ID === scheduleInfo.physician.ID)
                        break;
                prev[index].schedule = schedule;
                return prev;
            });
            onModalClose();
        } else {
            if (errorTID) clearTimeout(errorTID);
            setError('Failed!');
            errorTID = setTimeout(() => {
                setError('');
                errorTID = null;
            }, 3000);
        }
    };

    return (
        <div className={styles.appointment}>
            <div className={styles.search}>
                <div className={styles.inputs}>
                    <DateInput
                        label="Date"
                        content={date}
                        setContent={setDate}
                        width="250px"
                        height="40px"
                        size="24px"
                    />
                    <Input
                        label="Physician Name"
                        content={name}
                        setContent={setName}
                        width="250px"
                        height="40px"
                        size="24px"
                    />
                    <Select
                        label="Department"
                        content={department}
                        setContent={setDepartment}
                        width="250px"
                        height="40px"
                        size="24px"
                        list={departments}
                    />
                </div>
                <MainButton
                    background="var(--primary-color)"
                    color="white"
                    text="SEARCH"
                    width="200px"
                    height="40px"
                    onClick={onSearch}
                />
            </div>
            <div className={styles.schedule}>
                {physicians.map((physician, index) => {
                    return (
                        <div key={physician.ID}>
                            <EditableSingleSchedule
                                physician={physician.physician}
                                schedules={physician.schedule}
                                allowEdit={selected[index]}
                                onSelect={onSelect.bind(this, index)}
                            />
                            <MainButton
                                background={
                                    selected[index]
                                        ? 'var(--secondary-color)'
                                        : 'var(--primary-color)'
                                }
                                color="white"
                                text={selected[index] ? 'CANCEL' : 'ASSIGN'}
                                width="200px"
                                height="40px"
                                onClick={changeSelect.bind(this, index)}
                            />
                        </div>
                    );
                })}
            </div>
            <Modal isOpen={isModalOpen} style={modalStyle} ariaHideApp={false}>
                <div className={styles.modal}>
                    <span>Add Appointment</span>
                    {currentPage === 'patient'
                        ? patientPage(
                              SSN,
                              setSSN,
                              getPatient,
                              error,
                              patient,
                              onNext,
                              onModalClose,
                          )
                        : infoPage(
                              date,
                              scheduleInfo.st,
                              scheduleInfo.ed,
                              patient,
                              scheduleInfo.physician,
                              description,
                              setDescription,
                              onSubmit,
                              onModalClose,
                              error,
                          )}
                </div>
            </Modal>
        </div>
    );
};

export default Appointment;
