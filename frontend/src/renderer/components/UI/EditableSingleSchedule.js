import { useEffect, useRef, useState } from 'react';
import styles from './EditableSingleSchedule.module.scss';
import _styles from './SingleSchedule.module.scss';

const convertToTime = (posX) => {
    const hour = (Math.floor(posX / 120) + 8).toString().padStart(2, '0');
    const minute = Math.round((posX % 120) / 2)
        .toString()
        .padStart(2, '0');
    return `${hour}:${minute}`;
};

const convertToPosX = (timestamp) => {
    const time = timestamp.split(' ')[1];
    const [hour, minute, _] = time.split(':');
    return (parseInt(hour) - 8) * 120 + parseInt(minute) * 2;
};

// if time1 > time2
const compareTime = (time1, time2) => {
    console.log(`time1: ${time1} time2: ${time2}`);
    const [hour1, minute1, _] = time1.split(':');
    const [hour2, minute2, __] = time2.split(':');

    console.log(hour1, minute1, hour2, minute2);

    if (parseInt(hour1) > parseInt(hour2)) return true;
    else if (parseInt(hour1) === parseInt(hour2)) {
        if (parseInt(minute1) > parseInt(minute2)) return true;
    }

    return false;
};

const alignToClosest = (posX) => {
    return Math.round(posX / 20) * 20;
};

const checkCollision = (selected, schedules) => {
    for (const schedule of schedules) {
        const schedule_left = schedule.schedule_st.split(' ')[1];
        const schedule_right = schedule.schedule_ed.split(' ')[1];
        if (
            (compareTime(selected.right, schedule_left) &&
                compareTime(schedule_right, selected.right)) ||
            (compareTime(selected.left, schedule_left) &&
                compareTime(schedule_right, selected.left)) ||
            (!compareTime(schedule_right, selected.right) &&
                !compareTime(selected.left, schedule_left))
        )
            return true;
    }
    return false;
};

const EditableSingleSchedule = ({
    allowEdit,
    onSelect,
    physician,
    schedules,
}) => {
    const scheduleRef = useRef();

    const [selectLeft, setSelectLeft] = useState(0);
    const [selectRight, setSelectRight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const [selectTimeLeft, setSelectTimeLeft] = useState();
    const [selectTimeRight, setSelectTimeRight] = useState();

    const [isCollision, setIsCollision] = useState(false);

    useEffect(() => {
        if (
            typeof selectTimeLeft !== 'string' ||
            typeof selectTimeRight !== 'string'
        )
            return;

        if (
            checkCollision(
                { left: selectTimeLeft, right: selectTimeRight },
                schedules,
            )
        )
            setIsCollision(true);
        else setIsCollision(false);
    }, [selectTimeLeft, selectTimeRight]);

    console.log(isCollision);

    useEffect(() => {
        if (!allowEdit) setIsDragging(false);
    }, [allowEdit]);

    const handleMouseDown = (e) => {
        if (!allowEdit) return;

        const left = alignToClosest(
            e.clientX -
                scheduleRef.current.getBoundingClientRect().x +
                scheduleRef.current.scrollLeft,
        );

        setSelectLeft(left);
        setSelectRight(left);
        setIsDragging(true);

        setSelectTimeLeft(convertToTime(left));
        setSelectTimeRight(convertToTime(left));
    };

    const handleMouseMove = (e) => {
        if (e.buttons === 0) {
            setIsDragging(false);
            return;
        }

        if (!isDragging) return;

        const right = alignToClosest(
            e.clientX -
                scheduleRef.current.getBoundingClientRect().x +
                scheduleRef.current.scrollLeft,
        );

        if (right > 1300) return;

        setSelectRight(right);

        if (right < selectLeft) {
            setSelectTimeLeft(convertToTime(right));
            setSelectTimeRight(convertToTime(selectLeft));

            if (right < scheduleRef.current.scrollLeft + 50) {
                const diff = scheduleRef.current.scrollLeft + 50 - right;
                scheduleRef.current.scrollLeft -= diff;
            }
        } else {
            setSelectTimeLeft(convertToTime(selectLeft));
            setSelectTimeRight(convertToTime(right));
            if (
                right >
                scheduleRef.current.offsetWidth +
                    scheduleRef.current.scrollLeft -
                    50
            ) {
                const diff =
                    right -
                    (scheduleRef.current.scrollLeft +
                        scheduleRef.current.offsetWidth -
                        50);
                scheduleRef.current.scrollLeft += diff;
            }
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        if (isCollision) {
            setIsCollision(false);
            setSelectTimeLeft(null);
            setSelectTimeRight(null);
            return;
        }
        if (selectTimeLeft === selectTimeRight) return;
        if (allowEdit) onSelect(selectTimeLeft, selectTimeRight);
    };

    return (
        <div className={_styles.container}>
            <div className={_styles.info}>
                <div>
                    <span className={_styles.placeholder}></span>
                </div>
                <div>
                    <span style={{ fontWeight: 600 }}>Physician Detail</span>
                    <span>
                        {physician.first_name + ' ' + physician.last_name}
                    </span>
                    <span>{physician.title}</span>
                </div>
            </div>
            <div
                className={_styles.schedule}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={scheduleRef}
                style={{
                    cursor: allowEdit
                        ? isDragging
                            ? 'grabbing'
                            : 'grab'
                        : 'auto',
                }}
            >
                {isDragging ? (
                    <div
                        className={styles.selected}
                        style={{
                            left: Math.max(
                                Math.min(selectLeft, selectRight),
                                0,
                            ),
                            width: `${Math.abs(selectRight - selectLeft)}px`,
                            backgroundColor: isCollision
                                ? 'rgba(255, 0, 0, 0.5)'
                                : 'rgba(255, 165, 0, 0.5)',
                            borderColor: isCollision
                                ? 'rgba(255, 0, 0, 0.5)'
                                : 'rgba(255, 165, 0, 0.5)',
                        }}
                    >
                        <span>{selectTimeLeft}</span>
                        <span>{selectTimeRight}</span>
                    </div>
                ) : null}

                {schedules.map((schedule) => {
                    const left = convertToPosX(schedule.schedule_st);
                    const right = convertToPosX(schedule.schedule_ed);

                    return (
                        <div
                            key={schedule.created_at}
                            className={_styles.appointment}
                            style={{
                                left: left,
                                width: `${right - left}px`,
                            }}
                        ></div>
                    );
                })}

                {Array(11)
                    .fill('')
                    .map((_, index) => {
                        const time = (index + 8).toString();
                        return (
                            <div key={index} className={_styles.box}>
                                <span className={_styles.time}>
                                    {time.padStart(2, '0') + ':00'}
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default EditableSingleSchedule;
