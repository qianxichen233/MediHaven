import styles from './MessageList.module.scss';

const MessageList = (props) => {
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
            {props.messages.map((item, index) => (
                <div className={styles.item} key={index}>
                    <input
                        type="checkbox"
                        checked={props.select[index]}
                        onChange={props.onSelect.bind(this, index)}
                    ></input>
                    <span className={styles.from}>{item.from}</span>
                    <span className={styles.to}>{item.to}</span>
                    <span className={styles.type}>{item.type}</span>
                    <span className={styles.date}>{item.date}</span>
                    <span className={styles.status}>{item.status}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
