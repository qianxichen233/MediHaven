import { useEffect, useRef } from 'react';
import styles from './Tab.module.scss';

const Tab = (props) => {
    const calendarRef = useRef(null);
    const messagesRef = useRef(null);
    const slideRef = useRef(null);

    useEffect(() => {
        if (!slideRef.current) return;

        if (props.page === 'calendar' && !!calendarRef.current) {
            slideRef.current.style.left = `${
                calendarRef.current.getBoundingClientRect().x
            }px`;
        }

        if (props.page === 'messages' && !!messagesRef.current) {
            slideRef.current.style.left = `${
                messagesRef.current.getBoundingClientRect().x
            }px`;
        }
    }, [calendarRef, messagesRef, slideRef, props.page]);

    return (
        <div className={styles.tab}>
            <span className={styles.slide} ref={slideRef}></span>
            <span
                ref={calendarRef}
                className={props.page === 'calendar' ? styles.active : ''}
                onClick={props.onChange.bind(this, 'calendar')}
            >
                Calendar
            </span>
            <span
                ref={messagesRef}
                className={props.page === 'messages' ? styles.active : ''}
                onClick={props.onChange.bind(this, 'messages')}
            >
                Messages
            </span>
        </div>
    );
};

export default Tab;
