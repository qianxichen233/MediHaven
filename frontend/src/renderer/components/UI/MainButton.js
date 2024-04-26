import styles from './MainButton.module.scss';

const MainButton = ({
    text,
    onClick,
    background,
    color,
    width,
    height,
    disabled,
}) => {
    return (
        <button
            className={styles.button}
            style={{
                backgroundColor: background,
                color: color,
                width: width,
                height: height,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
                if (!disabled) onClick();
            }}
        >
            {text}
        </button>
    );
};

export default MainButton;
