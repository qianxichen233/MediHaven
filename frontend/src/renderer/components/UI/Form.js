import { useMemo, useState } from 'react';
import styles from './Form.module.scss';
import Button from './Button';

const Form = (props) => {
    const [inputs, setInputs] = useState(
        useMemo(() => {
            return Object.keys(props.content).reduce((acc, key) => {
                let content = '';
                if (typeof props.content[key] !== 'string')
                    content = props.content[key].content[0];

                return {
                    ...acc,
                    [key]: content,
                };
            }, {});
        }, [props.content]),
    );

    const handleInputChange = (key, e) => {
        // console.log(key, e);
        setInputs({
            ...inputs,
            [key]: e.target.value,
        });
    };

    const onSubmitHandler = () => {
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
