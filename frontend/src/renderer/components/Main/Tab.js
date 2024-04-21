import { useEffect, useRef, useState } from 'react';
import styles from './Tab.module.scss';

const Tab = (props) => {
    const refArray = useRef(Array(props.pagelist.length));

    const slideRef = useRef(null);

    // console.log(refArray.current.length);

    useEffect(() => {
        if (!slideRef.current) return;

        for (let i = 0; i < props.pagelist.length; ++i) {
            if (props.page === props.pagelist[i] && !!refArray.current[i]) {
                slideRef.current.style.left = `${
                    refArray.current[i].getBoundingClientRect().x
                }px`;
                return;
            }
        }
    }, [slideRef, refArray.current, props.page]);

    // if (refArray.current.length !== props.pagelist.length) return <></>;
    return (
        <div className={styles.tab}>
            <span className={styles.slide} ref={slideRef}></span>
            {props.pagelist.map((item, index) => {
                return (
                    <span
                        ref={(el) => (refArray.current[index] = el)}
                        className={props.page === item ? styles.active : ''}
                        onClick={props.onChange.bind(this, item)}
                        key={index}
                    >
                        {item}
                    </span>
                );
            })}
        </div>
    );
};

export default Tab;
