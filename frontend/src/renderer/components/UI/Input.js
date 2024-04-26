import styles from './Input.module.scss';

const Input = ({
    label,
    width,
    height,
    layout,
    content,
    setContent,
    size,
    disabled,
    error,
}) => {
    const onChange = (e) => {
        if (disabled) return;
        setContent(e.target.value);
    };

    let layoutStyle = {};
    if (layout === 'column') {
        layoutStyle = {
            flexDirection: 'column',
            alignItems: 'flex-end',
        };
    }

    return (
        <div
            className={`${styles.input} ${error ? styles.error : ''}`}
            style={layoutStyle}
        >
            <label style={{ fontSize: size }}>{label}</label>
            <input
                type="text"
                value={content}
                onChange={onChange}
                style={{ width: width, height: height, fontSize: size }}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;
