// Estados da conversa
export const ESTADOS = {
    INICIAL: 'initial',
    AGUARDANDO_OPCAO: 'awaiting_option',
    CATALOGO_CATEGORIAS: 'catalog_categories',
    CATALOGO_HAMBURGUERES: 'catalog_hamburgers',
    CATALOGO_BEBIDAS: 'catalog_drinks',
    CATALOGO_SOBREMESAS: 'catalog_desserts',
    AGUARDANDO_PEDIDO: 'awaiting_product_order'
};

// Mensagens do bot
export const MENSAGENS = {
    BOAS_VINDAS: 'Bom dia bem vindo a nossa loja como posso lhe ajudar hoje?\n1- Atendimento\n2- Produtos\n3- Financeiro',
    ATENDIMENTO: 'Entendido! Estamos lhe redirecionando ao nossa equipe de atendimento ao cliente! E já retornamos com uma resposta dentro de 5 minutos!',
    PRODUTOS: 'Aqui está o catálogo de produtos da loja. Escolha uma categoria:',
    PEDIDO_CONFIRMADO: 'Ok! Nossa equipe já está preparando seu produto a pronta entrega!',
    FINANCEIRO: 'A equipe FinPlay agradece o contato, como podemos ajudá-lo?',
    OPCAO_INVALIDA: 'Infelizmente não temos esta opção no momento, tente novamente ou digite sair para encerrar o atendimento.\n\nBom dia bem vindo a nossa loja como posso lhe ajudar hoje?\n1- Atendimento\n2- Produtos\n3- Financeiro',
    DESPEDIDA: 'Atendimento encerrado. Obrigado por entrar em contato!'
};

// Dados do catálogo
export const CATALOGO = {
    categorias: [
        { id: 'hamburguer', nome: 'Hambúrguer', icone: '🍔' },
        { id: 'bebidas', nome: 'Bebidas', icone: '🍹' },
        { id: 'sobremesas', nome: 'Sobremesas', icone: '🍰' }
    ],
    
    hamburguer: [
        {
            id: 'cheese',
            nome: 'Cheese',
            ingredientes: ['Pão', 'Hambúrguer bovino', 'Queijo cheddar', 'Alface', 'Tomate', 'Molho especial']
        },
        {
            id: 'vegano',
            nome: 'Vegano',
            ingredientes: ['Pão integral', 'Hambúrguer de grão-de-bico', 'Alface', 'Tomate', 'Cebola roxa', 'Molho de tahine']
        },
        {
            id: 'recheado',
            nome: 'Recheado',
            ingredientes: ['Pão brioche', 'Hambúrguer recheado com queijo', 'Bacon', 'Cebola caramelizada', 'Rúcula', 'Molho barbecue']
        },
        {
            id: 'gourmet',
            nome: 'Gourmet',
            ingredientes: ['Pão australiano', 'Hambúrguer angus', 'Queijo brie', 'Cebola crispy', 'Rúcula', 'Geleia de pimenta']
        },
        {
            id: 'picanha',
            nome: 'Picanha',
            ingredientes: ['Pão artesanal', 'Hambúrguer de picanha', 'Queijo provolone', 'Tomate', 'Alface', 'Maionese de alho']
        },
        {
            id: 'frango-grelhado',
            nome: 'Frango Grelhado',
            ingredientes: ['Pão integral', 'Peito de frango grelhado', 'Queijo mussarela', 'Alface', 'Tomate', 'Molho caesar']
        }
    ],
    
    bebidas: [
        {
            id: 'caipirinha',
            nome: 'Caipirinha',
            ingredientes: ['Cachaça', 'Limão', 'Açúcar', 'Gelo'],
            temDetalhes: true
        },
        {
            id: 'negroni',
            nome: 'Negroni',
            ingredientes: ['Gin', 'Vermute rosso', 'Campari', 'Laranja'],
            temDetalhes: true
        },
        {
            id: 'margarita',
            nome: 'Margarita',
            ingredientes: ['Tequila', 'Cointreau', 'Suco de limão', 'Sal', 'Gelo'],
            temDetalhes: true
        },
        {
            id: 'agua',
            nome: 'Água',
            temDetalhes: false
        },
        {
            id: 'coca-cola',
            nome: 'Coca Cola',
            temDetalhes: false
        },
        {
            id: 'suco-laranja',
            nome: 'Suco de Laranja',
            temDetalhes: false
        }
    ],
    
    sobremesas: [
        {
            id: 'pudim',
            nome: 'Pudim',
            ingredientes: ['Leite condensado', 'Leite', 'Ovos', 'Açúcar caramelizado']
        },
        {
            id: 'cheesecake',
            nome: 'Cheesecake',
            ingredientes: ['Cream cheese', 'Biscoito triturado', 'Manteiga', 'Frutas vermelhas', 'Geleia']
        },
        {
            id: 'sorbet',
            nome: 'Sorbet',
            ingredientes: ['Limão', 'Água', 'Açúcar', 'Raspas de limão']
        },
        {
            id: 'mousse',
            nome: 'Mousse',
            ingredientes: ['Polpa de maracujá', 'Creme de leite', 'Leite condensado', 'Gelatina']
        },
        {
            id: 'acai',
            nome: 'Açaí',
            ingredientes: ['Açaí puro']
        },
        {
            id: 'pave',
            nome: 'Pavê',
            ingredientes: ['Chocolate ao leite', 'Biscoito maisena', 'Leite', 'Creme de leite', 'Cacau em pó']
        }
    ]
};

// Processa a mensagem do usuário e retorna resposta e novo estado
export const processarMensagem = (mensagem, estadoAtual, catalogContext = null) => {
    const msg = mensagem.trim();
    
    // Verifica se quer sair
    if (msg.toLowerCase() === 'sair') {
        return {
            resposta: MENSAGENS.DESPEDIDA,
            novoEstado: ESTADOS.INICIAL,
            showCatalog: false
        };
    }
    
    // Estado inicial ou aguardando opção principal
    if (estadoAtual === ESTADOS.INICIAL || estadoAtual === ESTADOS.AGUARDANDO_OPCAO) {
        if (msg === '1') {
            return {
                resposta: MENSAGENS.ATENDIMENTO,
                novoEstado: ESTADOS.INICIAL,
                showCatalog: false
            };
        } else if (msg === '2') {
            return {
                resposta: MENSAGENS.PRODUTOS,
                novoEstado: ESTADOS.CATALOGO_CATEGORIAS,
                showCatalog: true,
                catalogType: 'categories'
            };
        } else if (msg === '3') {
            return {
                resposta: MENSAGENS.FINANCEIRO,
                novoEstado: ESTADOS.INICIAL,
                showCatalog: false
            };
        } else {
            return {
                resposta: MENSAGENS.OPCAO_INVALIDA,
                novoEstado: ESTADOS.AGUARDANDO_OPCAO,
                showCatalog: false
            };
        }
    }
    
    // Navegação no catálogo - Categorias
    if (estadoAtual === ESTADOS.CATALOGO_CATEGORIAS) {
        if (msg === 'hamburguer') {
            return {
                resposta: 'Confira nossos deliciosos hambúrgueres:',
                novoEstado: ESTADOS.CATALOGO_HAMBURGUERES,
                showCatalog: true,
                catalogType: 'hamburguer'
            };
        } else if (msg === 'bebidas') {
            return {
                resposta: 'Escolha sua bebida preferida:',
                novoEstado: ESTADOS.CATALOGO_BEBIDAS,
                showCatalog: true,
                catalogType: 'bebidas'
            };
        } else if (msg === 'sobremesas') {
            return {
                resposta: 'Deliciosas sobremesas para você:',
                novoEstado: ESTADOS.CATALOGO_SOBREMESAS,
                showCatalog: true,
                catalogType: 'sobremesas'
            };
        } else if (msg === 'voltar') {
            return {
                resposta: MENSAGENS.BOAS_VINDAS,
                novoEstado: ESTADOS.AGUARDANDO_OPCAO,
                showCatalog: false
            };
        }
    }
    
    // Estado de produtos - aguardando confirmação do pedido
    if (estadoAtual === ESTADOS.AGUARDANDO_PEDIDO) {
        return {
            resposta: MENSAGENS.PEDIDO_CONFIRMADO,
            novoEstado: ESTADOS.INICIAL,
            showCatalog: false
        };
    }
    
    // Caso padrão
    return {
        resposta: MENSAGENS.BOAS_VINDAS,
        novoEstado: ESTADOS.AGUARDANDO_OPCAO,
        showCatalog: false
    };
};

// Função auxiliar para obter dados do catálogo
export const getCatalogData = (type) => {
    switch(type) {
        case 'categories':
            return CATALOGO.categorias;
        case 'hamburguer':
            return CATALOGO.hamburguer;
        case 'bebidas':
            return CATALOGO.bebidas;
        case 'sobremesas':
            return CATALOGO.sobremesas;
        default:
            return [];
    }
};