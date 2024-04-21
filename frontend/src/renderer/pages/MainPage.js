import { useLocation } from 'react-router-dom';
import Header from '../components/Main/Header';
import Messages from '../components/Main/Subpages/Messages';
import Schedule from '../components/Main/Subpages/Schedule';
import styles from './MainPage.module.scss';

import { useState } from 'react';
import PhysicianMain from './subpages/PhysicianMain';
import ReceptionistMain from './subpages/ReceptionistMain';
import AdminMain from './subpages/AdminMain';

const MainPage = (props) => {
    const location = useLocation();
    const type = location.state.type;

    console.log(type);

    return (
        <div className="bg">
            {type === 'physician' ? (
                <PhysicianMain />
            ) : type === 'receptionist' ? (
                <ReceptionistMain />
            ) : (
                <AdminMain />
            )}
        </div>
    );
};

export default MainPage;
