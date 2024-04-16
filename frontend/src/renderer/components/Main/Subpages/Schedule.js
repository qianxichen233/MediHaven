import SingleSchedule from '../../UI/SingleSchedule';
import styles from './Schedule.module.scss';

const Schedule = (props) => {
    return (
        <div className={styles.container}>
            <SingleSchedule current={'9'} />
            <SingleSchedule current={'9'} />
            <SingleSchedule current={'9'} />
        </div>
    );
};

export default Schedule;
