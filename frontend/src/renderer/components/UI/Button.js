import style from "./Button.module.css";

const Button = (props) => {
    return (
        <div
            className={style.button}
            style={{
                backgroundColor: props.color,
                width: props.width,
                height: props.height,
            }}
            onClick={props.onClick}
        >
            {props.text}
        </div>
    );
};

export default Button;
