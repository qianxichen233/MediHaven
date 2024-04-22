import style from "./Language.module.css";

const Language = () => {
    return (
        <div className={style.Language}>
            <p>ENG</p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="12"
                viewBox="0 0 19 12"
                fill="none"
            >
                <path d="M9.5 12L18.5933 0H0.406734L9.5 12Z" fill="#45E4AB" />
            </svg>
        </div>
    );
};

export default Language;
