import RegisterForm from '../components/Account/RegisterForm';
import LoginForm from '../components/Account/LoginForm';
import styles from './AccountPage.module.scss';

import { useParams, useLocation } from 'react-router-dom';

const AccountPage = () => {
    const location = useLocation();
    let action = location.state.action;

    return (
        <div className="bg single-center">
            {action === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    );
};

export default AccountPage;
