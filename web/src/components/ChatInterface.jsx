import React, { useState, useRef, useEffect } from 'react';
import { processarMensagem, getCatalogData, MENSAGENS, ESTADOS, CATALOGO } from '../utils/chatbot';
import '../styles/chat.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { text: MENSAGENS.BOAS_VINDAS, sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [conversationState, setConversationState] = useState(ESTADOS.AGUARDANDO_OPCAO);
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogType, setCatalogType] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showCatalog]);

    const handleCategoryClick = (categoryId) => {
        processUserMessage(categoryId);
    };

    const handleProductClick = (productId) => {
        const newMessages = [...messages, 
            { text: `Você selecionou: ${productId}`, sender: 'user' }
        ];
        setMessages(newMessages);
        
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                text: 'Ótima escolha! Deseja adicionar mais algum item ou finalizar o pedido? (Digite "finalizar" para concluir)', 
                sender: 'bot' 
            }]);
            setConversationState(ESTADOS.AGUARDANDO_PEDIDO);
        }, 800);
    };

    const toggleExpand = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const processUserMessage = (userMessage) => {
        const newMessages = [...messages, { text: userMessage, sender: 'user' }];
        setMessages(newMessages);

        setTimeout(() => {
            const { resposta, novoEstado, showCatalog: shouldShowCatalog, catalogType: newCatalogType } = 
                processarMensagem(userMessage, conversationState);
            
            setMessages(prev => [...prev, { text: resposta, sender: 'bot' }]);
            setConversationState(novoEstado);
            setShowCatalog(shouldShowCatalog || false);
            setCatalogType(newCatalogType || null);
            setExpandedItems({});
        }, 800);
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            processUserMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const renderCatalog = () => {
        if (!showCatalog) return null;

        const data = getCatalogData(catalogType);

        if (catalogType === 'categories') {
            return (
                <div className="catalog-container">
                    <div className="catalog-grid">
                        {data.map(category => (
                            <div 
                                key={category.id}
                                className="catalog-card category-card"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className="category-icon">{category.icone}</div>
                                <h3 className="category-title">{category.nome}</h3>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="catalog-back-button"
                        onClick={() => processUserMessage('voltar')}
                    >
                        ← Voltar ao menu
                    </button>
                </div>
            );
        }

        // Renderizar produtos
        return (
            <div className="catalog-container">
                <div className="catalog-products-grid">
                    {data.map(item => (
                        <div key={item.id} className="product-card">
                            <div className="product-header">
                                <h3 className="product-title">{item.nome}</h3>
                                {item.ingredientes && (
                                    <button 
                                        className="expand-button"
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        {expandedItems[item.id] ? '−' : '+'}
                                    </button>
                                )}
                            </div>
                            
                            {expandedItems[item.id] && item.ingredientes && (
                                <div className="product-details">
                                    <p className="details-title">Ingredientes:</p>
                                    <ul className="ingredients-list">
                                        {item.ingredientes.map((ing, idx) => (
                                            <li key={idx}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <button 
                                className="add-to-cart-button"
                                onClick={() => handleProductClick(item.nome)}
                            >
                                Adicionar ao pedido
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    className="catalog-back-button"
                    onClick={() => {
                        setShowCatalog(true);
                        setCatalogType('categories');
                        setConversationState(ESTADOS.CATALOGO_CATEGORIAS);
                        setExpandedItems({});
                    }}
                >
                    ← Voltar às categorias
                </button>
            </div>
        );
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message-wrapper ${msg.sender}`}
                    >
                        <div className={`message-bubble ${msg.sender}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {renderCatalog()}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="chat-input"
                    />
                    <button
                        onClick={handleSend}
                        className="chat-send-button"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;