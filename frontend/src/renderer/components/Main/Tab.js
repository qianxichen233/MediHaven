import { useEffect, useRef, useState } from 'react';
import styles from './Tab.module.scss';

const getList = (pagelist, page, hide) => {
    if (!hide) return pagelist;
    const result = [];
    for (const p of pagelist) {
        if (hide.includes(p) && page !== p) continue;
        result.push(p);
    }
    return result;
};

const Tab = (props) => {
    const pagelist = getList(props.pagelist, props.page, props.hide);

    const refArray = useRef(Array(pagelist.length));

    const slideRef = useRef(null);

    // console.log(refArray.current.length);

    useEffect(() => {
        if (!slideRef.current) return;

        for (let i = 0; i < pagelist.length; ++i) {
            if (props.page === pagelist[i] && !!refArray.current[i]) {
                slideRef.current.style.left = `${
                    refArray.current[i].getBoundingClientRect().x
                }px`;
                return;
            }
        }
    }, [slideRef, refArray.current, props.page]);

    // if (refArray.current.length !== pagelist.length) return <></>;
    return (
        <div className={styles.tab}>
            <span className={styles.slide} ref={slideRef}></span>
            {pagelist.map((item, index) => {
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
