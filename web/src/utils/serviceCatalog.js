// Arquivo: web/src/utils/serviceCatalog.js
// Catálogo modular de serviços

// Estados da conversa
export const ESTADOS = {
    INICIAL: 'initial',
    AGUARDANDO_OPCAO: 'awaiting_option',
    CATALOGO_SERVICOS: 'catalog_services',
    AGUARDANDO_PEDIDO: 'awaiting_service_order',
    SELECIONANDO_SUBSERVICO: 'selecting_subservice'
};

// Mensagens do sistema
export const MENSAGENS = {
    BOAS_VINDAS: 'Bom dia! Bem-vindo ao FinPlay - Serviços Profissionais! 🌟\n\nComo posso ajudá-lo hoje?\n\n1️⃣  Atendimento Pessoal\n2️⃣  Serviços Disponíveis\n3️⃣  Financeiro\n\n💬 Ou digite sua dúvida diretamente!',
    ATENDIMENTO: 'Entendido! Estamos lhe redirecionando à nossa equipe de atendimento. Retornaremos em até 5 minutos! ⏰',
    SERVICOS: 'Aqui estão nossos serviços profissionais disponíveis. Clique em qualquer um para ver detalhes:',
    PEDIDO_CONFIRMADO: '✅ Ótimo! Seu pedido foi registrado e nossa equipe entrará em contato em breve para confirmar o agendamento!',
    FINANCEIRO: '💰 Equipe Financeira FinPlay.\nComo podemos ajudá-lo?',
    OPCAO_INVALIDA: '❌ Opção não reconhecida.\n\nDigite:\n1️⃣  Atendimento\n2️⃣  Serviços\n3️⃣  Financeiro\nOu "sair" para encerrar',
    DESPEDIDA: '👋 Obrigado por usar o FinPlay! Até logo!',
    SELECIONE_SUBSERVICO: 'Por favor, selecione o tipo de serviço desejado:'
};

// Catálogo de serviços
export const CATALOGO_SERVICOS = {
    pedreiro: {
        id: 'pedreiro',
        nome: '🏗️ Pedreiro',
        categoria: 'Construção',
        detalhes: {
            duracao: '8h/Dia',
            disponibilidade: 'Segunda à Sexta',
            preco: 'R$ 200,00/Dia'
        },
        descricao: 'Serviços de pedreiro profissional para construção e reformas',
        temSubservicos: false
    },
    pintor: {
        id: 'pintor',
        nome: '🎨 Pintor',
        categoria: 'Acabamento',
        detalhes: {
            duracao: '8h/Dia',
            disponibilidade: 'Segunda à Sábado',
            preco: 'R$ 300,00/Dia'
        },
        descricao: 'Pintura residencial e comercial com profissionais qualificados',
        temSubservicos: false
    },
    encanador: {
        id: 'encanador',
        nome: '🔧 Encanador',
        categoria: 'Hidráulica',
        detalhes: {
            duracao: '8h/Dia',
            disponibilidade: 'Segunda à Sábado',
            preco: 'R$ 280,00/Dia'
        },
        descricao: 'Instalação e manutenção de sistemas hidráulicos',
        temSubservicos: false
    },
    domestica: {
        id: 'domestica',
        nome: '🧹 Doméstica',
        categoria: 'Limpeza',
        detalhes: {
            duracao: '8h/Dia',
            disponibilidade: 'Segunda à Sábado',
            preco: 'R$ 200,00/Dia'
        },
        descricao: 'Serviços de limpeza e organização doméstica',
        temSubservicos: false
    },
    baba: {
        id: 'baba',
        nome: '👶 Babá',
        categoria: 'Cuidados',
        detalhes: {
            duracao: '8h/Dia',
            disponibilidade: 'Segunda à Domingo',
            preco: 'R$ 30,00/Hora'
        },
        descricao: 'Cuidados profissionais com crianças',
        temSubservicos: false
    },
    cabeleireira: {
        id: 'cabeleireira',
        nome: '💇 Cabeleireira',
        categoria: 'Beleza',
        detalhes: {
            duracao: '8h/Cliente',
            disponibilidade: 'Segunda à Sábado',
            preco: 'R$ 40,00 ~ R$ 500,00'
        },
        descricao: 'Serviços profissionais de cabelo',
        temSubservicos: true,
        subservicos: [
            {
                id: 'corte',
                nome: 'Corte',
                preco: 'R$ 40,00',
                duracao: '~1h'
            },
            {
                id: 'tintura-hidratacao',
                nome: 'Tintura + Hidratação',
                preco: 'R$ 300,00',
                duracao: '~4h'
            },
            {
                id: 'progressiva',
                nome: 'Progressiva',
                preco: 'R$ 500,00',
                duracao: '~5h'
            }
        ]
    },
    manicure: {
        id: 'manicure',
        nome: '💅 Manicure',
        categoria: 'Beleza',
        detalhes: {
            duracao: '1~3 horas',
            disponibilidade: 'Segunda à Sábado',
            preco: 'R$ 60,00 ~ R$ 150,00'
        },
        descricao: 'Serviços profissionais de manicure e pedicure',
        temSubservicos: true,
        subservicos: [
            {
                id: 'unha-simples',
                nome: 'Unha pé e mão simples',
                preco: 'R$ 60,00',
                duracao: '~1h'
            },
            {
                id: 'unha-gel',
                nome: 'Unha de Gel',
                preco: 'R$ 130,00',
                duracao: '~2h'
            },
            {
                id: 'fibra',
                nome: 'Fibra',
                preco: 'R$ 150,00',
                duracao: '~3h'
            }
        ]
    }
};

// Obter todos os serviços como array
export const getServicosArray = () => {
    return Object.values(CATALOGO_SERVICOS);
};

// Obter serviço por ID
export const getServicoPorId = (id) => {
    return CATALOGO_SERVICOS[id] || null;
};

// Obter subserviços de um serviço
export const getSubservicos = (servicoId) => {
    const servico = CATALOGO_SERVICOS[servicoId];
    return servico && servico.temSubservicos ? servico.subservicos : [];
};

// Validar se é um serviço válido
export const isServicoValido = (id) => {
    return id in CATALOGO_SERVICOS;
};

// Validar se é um subserviço válido
export const isSubservicoValido = (servicoId, subservicoId) => {
    const servico = CATALOGO_SERVICOS[servicoId];
    if (!servico || !servico.temSubservicos) return false;
    return servico.subservicos.some(sub => sub.id === subservicoId);
};

export default {
    ESTADOS,
    MENSAGENS,
    CATALOGO_SERVICOS,
    getServicosArray,
    getServicoPorId,
    getSubservicos,
    isServicoValido,
    isSubservicoValido
};