import { useEffect, useState } from 'react';
import SingleSchedule from '../../UI/SingleSchedule';
import styles from './Schedule.module.scss';
import { get_schedule } from '../../../api/schedule';
import { useMyContext } from '../../MyContext';

const Schedule = (props) => {
    const { user } = useMyContext();

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const getSchedule = async () => {
            const result = await get_schedule(
                user.role,
                user.email,
                '2024-03-25 8:00:00',
                '2024-03-25 16:00:00',
            );
            setSchedules(schedules);
        };

        getSchedule();
    }, []);

    console.log(schedules);

    return (
        <div className={styles.container}>
            {schedules.map((item, index) => {
                return <SingleSchedule current={'9'} schedule={item} />;
            })}
        </div>
    );
};

export default Schedule;
