import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import AccountPage from './pages/AccountPage';
import MainPage from './pages/MainPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/account" element={<AccountPage />} />
            </Routes>
        </Router>
    );
}
