// Arquivo: web/src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ServiceChatbot from './components/ServiceChatbot';
import Login from './components/Login';
import Register from './components/Register';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';
import './App.css';

function App() {
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

    // Se autenticado, mostrar aplicação principal com ServiceChatbot
    return (
        <div className="app-container">
            <Sidebar 
                user={user}
                onLogout={handleLogout}
            />
            <div className="main-content">
                <ServiceChatbot user={user} />
            </div>
        </div>
    );
}

export default App;