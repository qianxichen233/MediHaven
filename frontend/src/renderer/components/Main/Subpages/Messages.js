import { useState } from 'react';
import styles from './Messages.module.scss';
import MessageList from '../../UI/MessageList';
import Button from '../../UI/Button';

const test = [
    {
        from: 'alice',
        to: 'bob',
        type: 'message',
        date: '2024-4-16 12:31:12',
        status: 'unread',
    },
    {
        from: 'bob',
        to: 'alice',
        type: 'message',
        date: '2024-4-14 12:31:12',
        status: 'read',
    },
];

const Messages = (props) => {
    const [selected, setSelected] = useState(
        new Array(test.length).fill(false),
    );

    const onSetect = (index) => {
        console.log(index);
        setSelected((prev) => {
            const new_select = [...prev];
            new_select[index] = !new_select[index];
            console.log(new_select);
            return new_select;
        });
    };

    return (
        <div className={styles.container}>
            <MessageList
                messages={test}
                select={selected}
                onSelect={onSetect}
            />
            <div className={styles.buttons}>
                <button style={{ backgroundColor: '#45e4ab' }}>Add New</button>
                <button style={{ backgroundColor: '#F77' }}>Delete</button>
            </div>
        </div>
    );
};

export default Messages;
