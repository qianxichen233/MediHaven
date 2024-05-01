import { useEffect, useRef } from 'react';
import styles from './SingleSchedule.module.scss';
import { getCurrentTime } from '../../utils/utils';
import { PatientIcon, PhysicianIcon } from './Icon';

const convertToPosX = (timestamp) => {
    const time = timestamp.split(' ')[1];
    const [hour, minute, _] = time.split(':');
    return (parseInt(hour) - 8) * 120 + parseInt(minute) * 2;
};

const getAppointmentColor = (left, right, now) => {
    if (now > right) return 'rgba(211, 211, 211, 0.5)';
    else if (now >= left && now <= right) return 'rgba(0, 0, 255, 0.3)';
    return 'rgba(0, 128, 0, 0.5)';
};

const SingleSchedule = (props) => {
    const scheduleRef = useRef(null);

    const left = convertToPosX(props.schedule.schedule_st);
    const right = convertToPosX(props.schedule.schedule_ed);

    const now = convertToPosX(getCurrentTime());

    useEffect(() => {
        if (!scheduleRef.current) return;

        scheduleRef.current.scrollLeft = 120 * (parseInt(props.current) - 8);
    }, [scheduleRef]);

    console.log(props.schedule);

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div>
                    <div className={styles.placeholder}>
                        <PatientIcon height="80px" width="80px" />
                    </div>
                </div>
                <div>
                    <span style={{ fontWeight: 800 }}>
                        {props.schedule.patient_first_name}{' '}
                        {props.schedule.patient_last_name}
                    </span>
                    <span style={{ fontWeight: 600 }}>Reserved At</span>
                    <span style={{ fontStyle: 'italic' }}>
                        {props.schedule.created_at}
                    </span>
                    {/* <span># yr old / SEX</span>
                    <span>DOB: MM/DD/YY</span>
                    <span>MRN: #######</span> */}
                </div>
            </div>
            <div ref={scheduleRef} className={styles.schedule}>
                <div
                    className={styles.appointment}
                    style={{
                        left: left,
                        width: `${right - left}px`,
                        backgroundColor: getAppointmentColor(left, right, now),
                    }}
                    onClick={props.onSelect}
                >
                    <span>
                        {props.schedule.schedule_st
                            .split(' ')[1]
                            .split(':')
                            .slice(0, 2)
                            .join(':')}
                    </span>
                    <div>
                        <p>Appointment</p>
                        <p>{props.schedule.description}</p>
                    </div>
                    <span>
                        {props.schedule.schedule_ed
                            .split(' ')[1]
                            .split(':')
                            .slice(0, 2)
                            .join(':')}
                    </span>
                </div>
                {now >= 0 && now <= 1320 && (
                    <span className={styles.now} style={{ left: now }}></span>
                )}
                {Array(11)
                    .fill('')
                    .map((_, index) => {
                        const time = (index + 8).toString();
                        return (
                            <div key={index} className={styles.box}>
                                <span className={styles.time}>
                                    {time.padStart(2, '0') + ':00'}
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SingleSchedule;
