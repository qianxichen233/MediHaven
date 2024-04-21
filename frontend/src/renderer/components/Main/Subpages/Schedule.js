import { useEffect, useState } from 'react';
import SingleSchedule from '../../UI/SingleSchedule';
import styles from './Schedule.module.scss';
import { get_schedule } from '../../../api/schedule';
import { useMyContext } from '../../MyContext';
import { getCurrentDate } from '../../../utils/utils';

import Modal from 'react-modal';
import MainButton from '../../UI/MainButton';

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

const extract_time = (datetime) => {
    return datetime.split(' ')[1].split(':').slice(0, 2).join(':');
};

const sortSchedule = (a, b) => {
    const dateA = new Date(a.schedule_at);
    const dateB = new Date(b.schedule_at);

    if (dateA < dateB) {
        return -1;
    }
    if (dateA > dateB) {
        return 1;
    }
    return 0;
};

const Schedule = (props) => {
    const { user } = useMyContext();

    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const getSchedule = async () => {
            const result = await get_schedule(
                user.role,
                user.email,
                getCurrentDate() + ' 00:00:00',
                getCurrentDate() + ' 23:59:59',
                user.email,
            );
            result.sort(sortSchedule);
            setSchedules(result);
        };

        getSchedule();
    }, []);

    const onSelect = (index) => {
        setSelected(index);
        setIsModalOpen(true);
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        setSelected(null);
    };

    const onProceed = () => {
        console.log(schedules[selected]);
    };

    return (
        <div className={styles.container}>
            {schedules.map((item, index) => {
                return (
                    <SingleSchedule
                        current={new Date().getHours().toString()}
                        schedule={item}
                        key={index}
                        onSelect={onSelect.bind(this, index)}
                    />
                );
            })}
            {selected !== null && (
                <Modal
                    isOpen={isModalOpen}
                    style={modalStyle}
                    ariaHideApp={false}
                >
                    <div className={styles.modal}>
                        <div>
                            <span>Appointment Detail</span>
                            <div className={styles.info}>
                                <div>
                                    <label>Patient: </label>
                                    <span>
                                        {schedules[selected]
                                            .patient_first_name +
                                            ' ' +
                                            schedules[selected]
                                                .patient_last_name}
                                    </span>
                                </div>
                                <div>
                                    <label>SSN: </label>
                                    <span>
                                        {schedules[selected].patient_SSN}
                                    </span>
                                </div>
                                <div>
                                    <label>Scheduled Time: </label>
                                    <span>
                                        {extract_time(
                                            schedules[selected].schedule_st,
                                        ) +
                                            '-' +
                                            extract_time(
                                                schedules[selected].schedule_ed,
                                            )}
                                    </span>
                                </div>
                                <div className={styles.description}>
                                    <label>Description: </label>
                                    <p>{schedules[selected].description}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <MainButton
                                background="var(--primary-color)"
                                color="white"
                                text="PROCEED"
                                width="150px"
                                height="40px"
                                onClick={onProceed}
                            />
                            <MainButton
                                background="var(--secondary-color)"
                                color="white"
                                text="CANCEL"
                                width="150px"
                                height="40px"
                                onClick={onModalClose}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Schedule;
