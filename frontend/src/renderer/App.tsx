import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import AccountPage from './pages/AccountPage';
import MainPage from './pages/MainPage';
import { MyContextProvider } from './components/MyContext';

export default function App() {
    return (
        <MyContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/account" element={<AccountPage />} />
                </Routes>
            </Router>
        </MyContextProvider>
    );
}
