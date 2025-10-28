// Arquivo: web/src/components/Login.jsx
import React, { useState } from 'react';
import { login, validateEmail, validatePassword } from '../services/authService';
import '../styles/auth.css';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);

        try {
            const data = await login(email, password);
            console.log('Login bem-sucedido:', data.user);
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">FinPlay</h1>
                    <p className="auth-subtitle">Entre na sua conta</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="seu.email@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="auth-link-text">
                        Não tem uma conta?{' '}
                        <button
                            className="auth-link-button"
                            onClick={onSwitchToRegister}
                            disabled={loading}
                        >
                            Cadastre-se
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;