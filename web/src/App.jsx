// Arquivo: web/src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Documentation from './components/Documentation';
import ChatInterface from './components/ChatInterface';
import ChatGPTInterface from './components/ChatGPTInterface';
import Login from './components/Login';
import Register from './components/Register';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [authView, setAuthView] = useState('login'); // 'login' ou 'register'
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        // Verificar se usuário está autenticado ao carregar
        if (isAuthenticated()) {
            const currentUser = getCurrentUser();
            setUser(currentUser);
            setIsAuth(true);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAuth(true);
    };

    const handleRegisterSuccess = (userData) => {
        setUser(userData);
        setIsAuth(true);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setIsAuth(false);
        setCurrentPage('home');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Documentation />;
            case 'chat':
                return <ChatInterface user={user} />;
            case 'chatgpt':
                return <ChatGPTInterface user={user} />;
            default:
                return <Documentation />;
        }
    };

    // Se não estiver autenticado, mostrar tela de login/registro
    if (!isAuth) {
        if (authView === 'login') {
            return (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={() => setAuthView('register')}
                />
            );
        } else {
            return (
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => setAuthView('login')}
                />
            );
        }
    }

    // Se autenticado, mostrar aplicação principal
    return (
        <div className="app-container">
            <Sidebar 
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                user={user}
                onLogout={handleLogout}
            />
            <div className="main-content">
                {renderPage()}
            </div>
        </div>
    );
}

export default App;