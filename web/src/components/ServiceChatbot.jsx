// Arquivo: web/src/components/ServiceChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGPT } from '../services/api';
import { processarMensagem, deveFinalizar } from '../utils/serviceChatbot';
import { MENSAGENS, ESTADOS, getServicosArray, getServicoPorId, getSubservicos } from '../utils/serviceCatalog';
import '../styles/serviceChat.css';

const ServiceChatbot = ({ user }) => {
    const [messages, setMessages] = useState([
        { text: MENSAGENS.BOAS_VINDAS, sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [conversationState, setConversationState] = useState(ESTADOS.AGUARDANDO_OPCAO);
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogType, setCatalogType] = useState(null);
    const [context, setContext] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showCatalog]);

    // Processar mensagem do usuário
    const processUserMessage = async (userMessage) => {
        const newMessages = [...messages, { text: userMessage, sender: 'user' }];
        setMessages(newMessages);

        // Verificar se deve finalizar
        if (conversationState === ESTADOS.AGUARDANDO_PEDIDO && deveFinalizar(userMessage)) {
            setTimeout(() => {
                setMessages(prev => [...prev, { text: MENSAGENS.PEDIDO_CONFIRMADO, sender: 'bot' }]);
                setConversationState(ESTADOS.INICIAL);
                setShowCatalog(false);
                setContext({});
            }, 800);
            return;
        }

        setIsLoading(true);

        try {
            // Primeiro tentar processar com regras
            const resultado = processarMensagem(userMessage, conversationState, context);
            
            // Se useAI for true, usar IA
            if (resultado.useAI) {
                await usarIA(userMessage, resultado.novoEstado);
            } else {
                // Usar resposta das regras
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: resultado.resposta, sender: 'bot' }]);
                    setConversationState(resultado.novoEstado);
                    setShowCatalog(resultado.showCatalog || false);
                    setCatalogType(resultado.catalogType || null);
                    if (resultado.context) {
                        setContext(resultado.context);
                    }
                    setIsLoading(false);
                }, 800);
            }
        } catch (error) {
            setMessages(prev => [...prev, { 
                text: 'Desculpe, ocorreu um erro. Por favor, tente novamente.', 
                sender: 'bot',
                error: true
            }]);
            setIsLoading(false);
        }
    };

    // Usar IA (Groq) para responder
    const usarIA = async (userMessage, estadoAtual) => {
        try {
            // Criar contexto para a IA
            const systemPrompt = criarPromptSistema(estadoAtual);
            const history = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-8) // Últimas 4 interações
            ];

            // Chamar IA
            const response = await sendMessageToGPT(userMessage, history);
            
            // Atualizar histórico
            setConversationHistory(prev => [
                ...prev,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: response }
            ]);

            // Adicionar resposta
            setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao usar IA:', error);
            setMessages(prev => [...prev, { 
                text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou escolha uma das opções do menu.', 
                sender: 'bot',
                error: true
            }]);
            setIsLoading(false);
        }
    };

    // Criar prompt do sistema baseado no contexto
    const criarPromptSistema = (estadoAtual) => {
        const servicosDisponiveis = getServicosArray();
        const listaServicos = servicosDisponiveis.map(s => 
            `${s.nome}: ${s.descricao} - ${s.detalhes.preco} (${s.detalhes.disponibilidade})`
        ).join('\n');

        let contextoAdicional = '';
        if (estadoAtual === ESTADOS.CATALOGO_SERVICOS) {
            contextoAdicional = '\n\nO usuário está navegando no catálogo de serviços. Ajude-o a escolher um serviço apropriado.';
        } else if (estadoAtual === ESTADOS.SELECIONANDO_SUBSERVICO && context.servicoSelecionado) {
            const servico = getServicoPorId(context.servicoSelecionado);
            const subservicos = getSubservicos(context.servicoSelecionado);
            const listaSubservicos = subservicos.map(s => `${s.nome} - ${s.preco}`).join('\n');
            contextoAdicional = `\n\nO usuário selecionou o serviço "${servico.nome}" e está escolhendo entre:\n${listaSubservicos}`;
        }

        return `Você é um assistente virtual do FinPlay - Serviços Profissionais.

SERVIÇOS DISPONÍVEIS:
${listaServicos}

SUAS FUNÇÕES:
1. Ajudar usuários a encontrar e contratar serviços profissionais
2. Responder dúvidas sobre disponibilidade, preços e detalhes dos serviços
3. Ser educado, prestativo e objetivo
4. Sugerir serviços apropriados baseado nas necessidades do usuário

IMPORTANTE:
- Sempre confirme a disponibilidade e preços corretos
- Se o usuário perguntar sobre algo que não está no catálogo, seja honesto
- Incentive o usuário a usar as opções do menu quando apropriado
- Responda em português do Brasil de forma natural e amigável${contextoAdicional}`;
    };

    // Handler de serviço clicado
    const handleServiceClick = (servicoId) => {
        const servico = getServicoPorId(servicoId);
        if (servico.temSubservicos) {
            processUserMessage(servicoId);
        } else {
            processUserMessage(servicoId);
        }
    };

    // Handler de subserviço clicado
    const handleSubserviceClick = (subservicoId) => {
        processUserMessage(subservicoId);
    };

    // Toggle expand/collapse
    const toggleExpand = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Enviar mensagem
    const handleSend = () => {
        if (inputValue.trim() && !isLoading) {
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

    // Renderizar catálogo de serviços
    const renderServiceCatalog = () => {
        if (!showCatalog) return null;

        if (catalogType === 'services') {
            const servicos = getServicosArray();
            
            return (
                <div className="catalog-container">
                    <div className="catalog-products-grid">
                        {servicos.map(servico => (
                            <div key={servico.id} className="product-card">
                                <div className="product-header">
                                    <h3 className="product-title">{servico.nome}</h3>
                                    <button 
                                        className="expand-button"
                                        onClick={() => toggleExpand(servico.id)}
                                    >
                                        {expandedItems[servico.id] ? '−' : '+'}
                                    </button>
                                </div>
                                
                                {expandedItems[servico.id] && (
                                    <div className="product-details">
                                        <p className="details-title">Detalhes do Serviço:</p>
                                        <ul className="ingredients-list">
                                            <li><strong>Duração:</strong> {servico.detalhes.duracao}</li>
                                            <li><strong>Disponibilidade:</strong> {servico.detalhes.disponibilidade}</li>
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="service-price">
                                    {servico.detalhes.preco}
                                </div>
                                
                                <button 
                                    className="add-to-cart-button"
                                    onClick={() => handleServiceClick(servico.id)}
                                >
                                    Solicitar Serviço
                                </button>
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

        if (catalogType === 'subservices' && context.servicoSelecionado) {
            const servico = getServicoPorId(context.servicoSelecionado);
            const subservicos = getSubservicos(context.servicoSelecionado);
            
            return (
                <div className="catalog-container">
                    <div className="subservice-header">
                        <h3>{servico.nome} - Escolha o tipo de serviço:</h3>
                    </div>
                    <div className="catalog-products-grid">
                        {subservicos.map(subservico => (
                            <div key={subservico.id} className="product-card subservice-card">
                                <div className="product-header">
                                    <h3 className="product-title">{subservico.nome}</h3>
                                </div>
                                
                                <div className="subservice-info">
                                    <p><strong>Duração:</strong> {subservico.duracao}</p>
                                </div>
                                
                                <div className="service-price">
                                    {subservico.preco}
                                </div>
                                
                                <button 
                                    className="add-to-cart-button"
                                    onClick={() => handleSubserviceClick(subservico.id)}
                                >
                                    Solicitar
                                </button>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="catalog-back-button"
                        onClick={() => processUserMessage('voltar')}
                    >
                        ← Voltar aos serviços
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="chat-container">
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
                
                {renderServiceCatalog()}
                
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
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        className="chat-send-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceChatbot;