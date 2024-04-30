import { useMyContext } from '../MyContext';
import styles from './MessageList.module.scss';

const MessageList = (props) => {
    const { user } = useMyContext();

    console.log(props.messages);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <input type="checkbox"></input>
                <span className={styles.from}>From</span>
                <span className={styles.to}>To</span>
                <span className={styles.type}>Type</span>
                <span className={styles.date}>Date</span>
                <span className={styles.status}>Status</span>
            </div>
            {props.messages.map((item, index) => {
                let from = `${item.email} (${item.role})`;
                let to = 'Me';

                if (item.email === user.email && item.role === user.role) {
                    let tmp = from;
                    from = to;
                    to = tmp;
                }

                return (
                    <div
                        className={styles.item}
                        key={index}
                        onClick={props.onClick.bind(this, index)}
                    >
                        <input
                            type="checkbox"
                            checked={props.select[index]}
                            onChange={props.onSelect.bind(this, index)}
                        ></input>
                        <span className={styles.from}>{from}</span>
                        <span className={styles.to}>{to}</span>
                        <span className={styles.type}>{item.type}</span>
                        <span className={styles.date}>{item.timestamp}</span>
                        <span className={styles.status}>read</span>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;
