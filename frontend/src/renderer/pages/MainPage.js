import Header from '../components/Main/Header';
import Messages from '../components/Main/Subpages/Messages';
import Schedule from '../components/Main/Subpages/Schedule';
import styles from './MainPage.module.scss';

import { useState } from 'react';

const MainPage = (props) => {
    const [page, setPage] = useState('calendar');

    const onPageChange = (page) => {
        setPage(page);
    };

    return (
        <div className="bg">
            <Header page={page} onPageChange={onPageChange} />
            {page === 'calendar' ? <Schedule /> : <Messages />}
        </div>
    );
};

export default MainPage;
