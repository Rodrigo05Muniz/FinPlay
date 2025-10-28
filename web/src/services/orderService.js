// Arquivo: web/src/services/orderService.js

import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Criar novo pedido
export const createOrder = async (items, notes = '') => {
    try {
        const token = getToken();
        
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                items,
                notes
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar pedido');
        }

        return data;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
};

// Finalizar pedido
export const completeOrder = async (orderId) => {
    try {
        const token = getToken();
        
        const response = await fetch(`${API_URL}/api/orders/complete?id=${orderId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao finalizar pedido');
        }

        return data;
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        throw error;
    }
};

// Buscar histórico de pedidos
export const getOrderHistory = async () => {
    try {
        const token = getToken();
        
        const response = await fetch(`${API_URL}/api/orders/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar histórico');
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        throw error;
    }
};

// Cancelar pedido
export const cancelOrder = async (orderId) => {
    try {
        const token = getToken();
        
        const response = await fetch(`${API_URL}/api/orders/cancel?id=${orderId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao cancelar pedido');
        }

        return data;
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        throw error;
    }
};