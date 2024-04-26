import { useState } from 'react';
import Header from '../../components/Main/Header';
import Messages from '../../components/Main/Subpages/Messages';
import Schedule from '../../components/Main/Subpages/Schedule';
import Diagnose from '../../components/Main/Subpages/Diagnose';

const PhysicianMain = (props) => {
    const [page, setPage] = useState('Calendar');
    const [context, setContext] = useState();

    const onPageChange = (page, context) => {
        setPage(page);
        if (!context) setContext(null);
        else setContext(context);
    };

    return (
        <>
            <Header
                page={page}
                onPageChange={onPageChange}
                pagelist={['Calendar', 'Diagnose', 'Messages']}
                hide={['Diagnose']}
            />
            {page === 'Calendar' ? (
                <Schedule onDiagnose={onPageChange.bind(this, 'Diagnose')} />
            ) : page === 'Messages' ? (
                <Messages />
            ) : (
                <Diagnose
                    {...context}
                    onFinished={setPage.bind(null, 'Calendar')}
                />
            )}
        </>
    );
};

export default PhysicianMain;
