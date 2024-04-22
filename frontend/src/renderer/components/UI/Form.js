import { useEffect, useMemo, useState } from 'react';
import styles from './Form.module.scss';
import Button from './Button';

const init = (contents) => {
    return Object.keys(contents).reduce((acc, key) => {
        let content = '';
        if (typeof contents[key] !== 'string')
            content = contents[key].content[0];

        return {
            ...acc,
            [key]: content,
        };
    }, {});
};

const Form = (props) => {
    const [inputs, setInputs] = useState(init(props.content));

    const handleInputChange = (key, e) => {
        // console.log(key, e);
        setInputs({
            ...inputs,
            [key]: e.target.value,
        });
    };

    useEffect(() => {
        setInputs(init(props.content));
    }, [props.content]);

    const onSubmitHandler = () => {
        console.log(inputs);
        for (const [key, value] of Object.entries(inputs)) {
            if (value === '') return;
        }

        props.onSubmit(inputs);
    };

    // console.log(props.content);

    return (
        <div className={styles.form}>
            <p className={styles.title}>{props.title}</p>
            {Object.entries(props.content).map(([key, value]) => {
                return (
                    <div
                        className={styles.item}
                        key={key}
                        style={{
                            flexBasis: `${(100 / props.column).toFixed(2)}%`,
                        }}
                    >
                        <label>{key}</label>
                        {typeof value === 'string' ? (
                            <input
                                type={value}
                                value={inputs[key]}
                                onChange={handleInputChange.bind(this, key)}
                            />
                        ) : (
                            <select
                                value={inputs[key]}
                                onChange={handleInputChange.bind(this, key)}
                            >
                                {value.content.map((option) => (
                                    <option value={option}>{option}</option>
                                ))}
                            </select>
                        )}
                    </div>
                );
            })}
            <div
                className={`${styles.item} ${
                    !(Object.keys(props.content).length & 1)
                        ? styles.center
                        : ''
                }`}
                style={{
                    flexBasis: `${(100 / props.column).toFixed(2)}%`,
                }}
            >
                <button className={styles.submit} onClick={onSubmitHandler}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Form;
