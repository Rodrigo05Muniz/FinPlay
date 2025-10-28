import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGPT, checkServerHealth } from '../services/api';
import '../styles/chat.css';

const ChatGPTInterface = () => {
    const [messages, setMessages] = useState([
        { 
            text: 'Olá! Sou o assistente virtual da FinPlay. Como posso ajudá-lo hoje?', 
            sender: 'bot' 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverOnline, setServerOnline] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        checkHealth();
    }, []);

    const checkHealth = async () => {
        const online = await checkServerHealth();
        setServerOnline(online);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (inputValue.trim() && !isLoading) {
            const userMessage = inputValue;
            
            // Adiciona mensagem do usuário
            const newMessages = [...messages, { text: userMessage, sender: 'user' }];
            setMessages(newMessages);
            setInputValue('');
            setIsLoading(true);

            try {
                // Prepara histórico para GPT (últimas 10 mensagens)
                const history = messages.slice(-10).map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                }));

                // Envia para GPT
                const response = await sendMessageToGPT(userMessage, history);
                
                setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
            } catch (error) {
                setMessages(prev => [...prev, { 
                    text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', 
                    sender: 'bot',
                    error: true
                }]);
                checkHealth();
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            {!serverOnline && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    ⚠️ Servidor offline. Certifique-se de que o backend está rodando.
                </div>
            )}
            
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message-wrapper ${msg.sender}`}
                    >
                        <div className={`message-bubble ${msg.sender} ${msg.error ? 'error' : ''}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="message-wrapper bot">
                        <div className="message-bubble bot">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isLoading ? "Aguardando resposta..." : "Digite sua mensagem..."}
                        className="chat-input"
                        disabled={isLoading || !serverOnline}
                    />
                    <button
                        onClick={handleSend}
                        className="chat-send-button"
                        disabled={isLoading || !serverOnline}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatGPTInterface;