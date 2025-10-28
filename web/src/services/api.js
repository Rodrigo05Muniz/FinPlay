const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const sendMessageToGPT = async (message, history = []) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                history
            })
        });

        if (!response.ok) {
            throw new Error('Erro na comunicação com o servidor');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return data.response;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
};

export const checkServerHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
};