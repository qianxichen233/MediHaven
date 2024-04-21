import styles from './Input.module.scss';

const Input = ({ label, width, height, layout, content, setContent, size }) => {
    const onChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className={styles.input}>
            <label style={{ fontSize: size }}>{label}</label>
            <input
                type="text"
                value={content}
                onChange={onChange}
                style={{ width: width, height: height, fontSize: size }}
            />
        </div>
    );
};

export default Input;
