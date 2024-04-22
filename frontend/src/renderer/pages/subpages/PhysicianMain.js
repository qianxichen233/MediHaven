import { useState } from 'react';
import Header from '../../components/Main/Header';
import Messages from '../../components/Main/Subpages/Messages';
import Schedule from '../../components/Main/Subpages/Schedule';

const PhysicianMain = (props) => {
    const [page, setPage] = useState('Calendar');

    const onPageChange = (page) => {
        setPage(page);
    };

    return (
        <>
            <Header
                page={page}
                onPageChange={onPageChange}
                pagelist={['Calendar', 'Messages']}
            />
            {page === 'Calendar' ? <Schedule /> : <Messages />}
        </>
    );
};

export default PhysicianMain;
