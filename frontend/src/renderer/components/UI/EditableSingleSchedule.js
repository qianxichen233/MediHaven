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

const alignToClosest = (posX) => {
    return Math.round(posX / 20) * 20;
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
                        }}
                    >
                        <span>{selectTimeLeft}</span>
                        <span>{selectTimeRight}</span>
                    </div>
                ) : null}

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
