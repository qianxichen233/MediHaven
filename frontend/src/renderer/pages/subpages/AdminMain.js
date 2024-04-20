import { useState } from 'react';
import Header from '../../components/Main/Header';
import Code from '../../components/Main/Subpages/Code';
import Messages from '../../components/Main/Subpages/Messages';

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
            {page === 'Code' ? <Code /> : <Messages />}
        </>
    );
};

export default AdminMain;
