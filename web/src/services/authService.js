// Arquivo: web/src/services/authService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Registrar novo usuário
export const register = async (email, password, fullName) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Importante para cookies
            body: JSON.stringify({
                email,
                password,
                full_name: fullName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro no registro');
        }

        // Salvar token no localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('Erro no registro:', error);
        throw error;
    }
};

// Login
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro no login');
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

// Logout
export const logout = async () => {
    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Erro no logout:', error);
        // Mesmo com erro, limpar dados locais
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }
};

// Verificar se está autenticado
export const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
};

// Obter usuário atual
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

// Obter token
export const getToken = () => {
    return localStorage.getItem('auth_token');
};

// Validar email (mesmo regex do backend)
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return 'Formato de email inválido';
    }

    const providerRegex = /@(gmail|yahoo|hotmail|outlook|live|icloud|protonmail|aol)\.(com|com\.br|net|org)$/;
    if (!providerRegex.test(email)) {
        return 'Use um provedor de email válido (Gmail, Yahoo, Hotmail, Outlook, etc.)';
    }

    return null;
};

// Validar senha
export const validatePassword = (password) => {
    if (password.length < 8) {
        return 'Senha deve ter no mínimo 8 caracteres';
    }
    return null;
};