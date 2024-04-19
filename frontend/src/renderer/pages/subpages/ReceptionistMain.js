import { useState } from 'react';
import Header from '../../components/Main/Header';

const ReceptionistMain = (props) => {
    const [page, setPage] = useState('Appointment');

    const onPageChange = (page) => {
        setPage(page);
    };

    return (
        <>
            <Header
                page={page}
                onPageChange={onPageChange}
                pagelist={['Appointment', 'Register', 'Messages']}
            />
            {/* {page === 'Calendar' ? <Schedule /> : <Messages />} */}
        </>
    );
};

export default ReceptionistMain;
