import { useState } from 'react';
import Header from '../../components/Main/Header';
import Appointment from '../../components/Main/Subpages/Appointment';
import RegisterPatient from '../../components/Main/Subpages/RegisterPatient';

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
            {page === 'Appointment' ? (
                <Appointment />
            ) : page === 'Register' ? (
                <RegisterPatient />
            ) : (
                <Messages />
            )}
        </>
    );
};

export default ReceptionistMain;
