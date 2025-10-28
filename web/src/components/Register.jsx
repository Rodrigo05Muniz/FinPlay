// Arquivo: web/src/components/Register.jsx
import React, { useState } from 'react';
import { register, validateEmail, validatePassword } from '../services/authService';
import '../styles/auth.css';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!formData.fullName.trim()) {
            setError('Nome completo é obrigatório');
            return;
        }

        const emailError = validateEmail(formData.email);
        if (emailError) {
            setError(emailError);
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const data = await register(formData.email, formData.password, formData.fullName);
            console.log('Registro bem-sucedido:', data.user);
            onRegisterSuccess(data.user);
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
                    <p className="auth-subtitle">Crie sua conta</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">Nome Completo</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-input"
                            placeholder="Seu nome completo"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="seu.email@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <p className="form-hint">Use Gmail, Yahoo, Hotmail, Outlook, etc.</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="Digite a senha novamente"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="auth-link-text">
                        Já tem uma conta?{' '}
                        <button
                            className="auth-link-button"
                            onClick={onSwitchToLogin}
                            disabled={loading}
                        >
                            Faça login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;