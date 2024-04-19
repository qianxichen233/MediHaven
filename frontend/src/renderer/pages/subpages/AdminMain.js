import { useState } from 'react';
import Header from '../../components/Main/Header';

const AdminMain = (props) => {
    const [page, setPage] = useState('Code');

    const onPageChange = (page) => {
        setPage(page);
    };

    return (
        <>
            <Header
                page={page}
                onPageChange={onPageChange}
                pagelist={['Code', 'Messages']}
            />
            {/* {page === 'Calendar' ? <Schedule /> : <Messages />} */}
        </>
    );
};

export default AdminMain;
