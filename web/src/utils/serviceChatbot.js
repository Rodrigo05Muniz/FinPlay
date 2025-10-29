// Arquivo: web/src/utils/serviceChatbot.js
// Lógica de processamento do chatbot de serviços

import { 
    ESTADOS, 
    MENSAGENS, 
    isServicoValido,
    isSubservicoValido,
    getServicoPorId,
    getSubservicos
} from './serviceCatalog';

/**
 * Processa a mensagem do usuário e retorna a resposta apropriada
 * @param {string} mensagem - Mensagem do usuário
 * @param {string} estadoAtual - Estado atual da conversa
 * @param {Object} context - Contexto adicional (serviço selecionado, etc.)
 * @returns {Object} - { resposta, novoEstado, showCatalog, catalogType, context }
 */
export const processarMensagem = (mensagem, estadoAtual, context = {}) => {
    const msg = mensagem.trim().toLowerCase();
    
    // Comando sair
    if (msg === 'sair') {
        return {
            resposta: MENSAGENS.DESPEDIDA,
            novoEstado: ESTADOS.INICIAL,
            showCatalog: false,
            useAI: false
        };
    }
    
    // Estado inicial ou aguardando opção
    if (estadoAtual === ESTADOS.INICIAL || estadoAtual === ESTADOS.AGUARDANDO_OPCAO) {
        return processarOpcaoPrincipal(msg);
    }
    
    // Catálogo de serviços
    if (estadoAtual === ESTADOS.CATALOGO_SERVICOS) {
        return processarCatalogoServicos(mensagem, context);
    }
    
    // Selecionando subserviço
    if (estadoAtual === ESTADOS.SELECIONANDO_SUBSERVICO) {
        return processarSubservico(mensagem, context);
    }
    
    // Aguardando pedido
    if (estadoAtual === ESTADOS.AGUARDANDO_PEDIDO) {
        return {
            resposta: MENSAGENS.PEDIDO_CONFIRMADO,
            novoEstado: ESTADOS.INICIAL,
            showCatalog: false,
            useAI: false
        };
    }
    
    // Caso não reconhecido - usar IA
    return {
        resposta: null,
        novoEstado: estadoAtual,
        showCatalog: false,
        useAI: true
    };
};

/**
 * Processa as opções principais do menu
 */
const processarOpcaoPrincipal = (msg) => {
    switch (msg) {
        case '1':
        case 'atendimento':
            return {
                resposta: MENSAGENS.ATENDIMENTO,
                novoEstado: ESTADOS.INICIAL,
                showCatalog: false,
                useAI: false
            };
            
        case '2':
        case 'servicos':
        case 'serviços':
        case 'servico':
        case 'serviço':
            return {
                resposta: MENSAGENS.SERVICOS,
                novoEstado: ESTADOS.CATALOGO_SERVICOS,
                showCatalog: true,
                catalogType: 'services',
                useAI: false
            };
            
        case '3':
        case 'financeiro':
            return {
                resposta: MENSAGENS.FINANCEIRO,
                novoEstado: ESTADOS.INICIAL,
                showCatalog: false,
                useAI: false
            };
            
        default:
            // Se não é uma opção do menu, usar IA
            return {
                resposta: null,
                novoEstado: ESTADOS.AGUARDANDO_OPCAO,
                showCatalog: false,
                useAI: true
            };
    }
};

/**
 * Processa seleção no catálogo de serviços
 */
const processarCatalogoServicos = (mensagem, context) => {
    const msg = mensagem.trim().toLowerCase();
    
    // Comando voltar
    if (msg === 'voltar' || msg === 'menu') {
        return {
            resposta: MENSAGENS.BOAS_VINDAS,
            novoEstado: ESTADOS.AGUARDANDO_OPCAO,
            showCatalog: false,
            useAI: false
        };
    }
    
    // Verificar se selecionou um serviço válido
    if (isServicoValido(msg)) {
        const servico = getServicoPorId(msg);
        
        // Se tem subserviços, mostrar opções
        if (servico.temSubservicos) {
            return {
                resposta: MENSAGENS.SELECIONE_SUBSERVICO,
                novoEstado: ESTADOS.SELECIONANDO_SUBSERVICO,
                showCatalog: true,
                catalogType: 'subservices',
                context: { servicoSelecionado: msg },
                useAI: false
            };
        } else {
            // Se não tem subserviços, confirmar diretamente
            return {
                resposta: `📦 Serviço "${servico.nome}" adicionado!\n\n${servico.detalhes.preco}\n\nDeseja adicionar mais algum serviço ou finalizar?\n(Digite "finalizar" para concluir)`,
                novoEstado: ESTADOS.AGUARDANDO_PEDIDO,
                showCatalog: false,
                context: { servicoSelecionado: msg },
                useAI: false
            };
        }
    }
    
    // Se não reconheceu, usar IA
    return {
        resposta: null,
        novoEstado: ESTADOS.CATALOGO_SERVICOS,
        showCatalog: true,
        catalogType: 'services',
        useAI: true
    };
};

/**
 * Processa seleção de subserviço
 */
const processarSubservico = (mensagem, context) => {
    const msg = mensagem.trim().toLowerCase();
    const { servicoSelecionado } = context;
    
    // Comando voltar
    if (msg === 'voltar') {
        return {
            resposta: MENSAGENS.SERVICOS,
            novoEstado: ESTADOS.CATALOGO_SERVICOS,
            showCatalog: true,
            catalogType: 'services',
            useAI: false
        };
    }
    
    // Verificar se é um subserviço válido
    if (isSubservicoValido(servicoSelecionado, msg)) {
        const servico = getServicoPorId(servicoSelecionado);
        const subservico = servico.subservicos.find(sub => sub.id === msg);
        
        return {
            resposta: `📦 Serviço "${servico.nome} - ${subservico.nome}" adicionado!\n\n${subservico.preco}\nDuração estimada: ${subservico.duracao}\n\nDeseja adicionar mais algum serviço ou finalizar?\n(Digite "finalizar" para concluir)`,
            novoEstado: ESTADOS.AGUARDANDO_PEDIDO,
            showCatalog: false,
            context: { 
                servicoSelecionado, 
                subservicoSelecionado: msg 
            },
            useAI: false
        };
    }
    
    // Se não reconheceu, usar IA
    return {
        resposta: null,
        novoEstado: ESTADOS.SELECIONANDO_SUBSERVICO,
        showCatalog: true,
        catalogType: 'subservices',
        context,
        useAI: true
    };
};

/**
 * Verifica se deve finalizar o pedido
 */
export const deveFinalizar = (mensagem) => {
    const msg = mensagem.trim().toLowerCase();
    return msg === 'finalizar' || msg === 'concluir' || msg === 'confirmar';
};

export default {
    processarMensagem,
    deveFinalizar
};