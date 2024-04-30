import styles from './Select.module.scss';

const Select = ({
    label,
    content,
    setContent,
    width,
    height,
    layout,
    size,
    list,
    noAny,
}) => {
    const onChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className={styles.select}>
            <label style={{ fontSize: size }}>{label}</label>
            <select
                onChange={onChange}
                value={content}
                style={{ width: width, height: height, fontSize: size }}
            >
                {!noAny && <option value="Any">Any</option>}
                {list.map((item, index) => {
                    return (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;
