import styles from './DateInput.module.scss';

const DateInput = ({
    label,
    content,
    setContent,
    width,
    height,
    layout,
    size,
    list,
}) => {
    const onChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className={styles.date}>
            <label style={{ fontSize: size }}>{label}</label>
            <input
                type="date"
                value={content}
                onChange={onChange}
                style={{ width: width, height: height, fontSize: size }}
            />
        </div>
    );
};

export default DateInput;
