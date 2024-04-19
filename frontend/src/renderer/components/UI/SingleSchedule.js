import { useEffect, useRef } from 'react';
import styles from './SingleSchedule.module.scss';

const SingleSchedule = (props) => {
    const scheduleRef = useRef(null);

    useEffect(() => {
        if (!scheduleRef.current) return;

        scheduleRef.current.scrollLeft = 120 * (parseInt(props.current) - 8);
    }, [scheduleRef]);

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div>
                    <span className={styles.placeholder}></span>
                </div>
                <div>
                    <span>Last, First</span>
                    <span># yr old / SEX</span>
                    <span>DOB: MM/DD/YY</span>
                    <span>MRN: #######</span>
                </div>
            </div>
            <div ref={scheduleRef} className={styles.schedule}>
                <div className={props.current === '8' ? styles.highlight : ''}>
                    <span className={styles.time}>08:00</span>
                </div>
                <div className={props.current === '9' ? styles.highlight : ''}>
                    <span className={styles.time}>09:00</span>
                </div>
                <div className={props.current === '10' ? styles.highlight : ''}>
                    <span className={styles.time}>10:00</span>
                </div>
                <div className={props.current === '11' ? styles.highlight : ''}>
                    <span className={styles.time}>11:00</span>
                </div>
                <div className={props.current === '12' ? styles.highlight : ''}>
                    <span className={styles.time}>12:00</span>
                </div>
                <div className={props.current === '13' ? styles.highlight : ''}>
                    <span className={styles.time}>13:00</span>
                </div>
                <div className={props.current === '14' ? styles.highlight : ''}>
                    <span className={styles.time}>14:00</span>
                </div>
                <div className={props.current === '15' ? styles.highlight : ''}>
                    <span className={styles.time}>15:00</span>
                </div>
                <div className={props.current === '16' ? styles.highlight : ''}>
                    <span className={styles.time}>16:00</span>
                </div>
                <div className={props.current === '17' ? styles.highlight : ''}>
                    <span className={styles.time}>17:00</span>
                </div>
                <div className={props.current === '18' ? styles.highlight : ''}>
                    <span className={styles.time}>18:00</span>
                </div>
            </div>
        </div>
    );
};

export default SingleSchedule;
