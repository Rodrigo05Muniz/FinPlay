// Arquivo: web/src/components/Documentation.jsx
import React from 'react';
import '../styles/documentation.css';

const Documentation = () => {
    return (
        <div className="documentation-container">
            <h1 className="documentation-title">FinPlay</h1>
            
            <p className="documentation-description">
                Sistema completo de chatbot com autenticação JWT, banco de dados PostgreSQL e 
                catálogo visual interativo. Combina automação com inteligência artificial para 
                atendimento ao cliente profissional.
            </p>

            {/* SOBRE O PROJETO */}
            <section className="documentation-section">
                <h2 className="section-title">Sobre o Projeto</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--cor-texto-secondary)' }}>
                    O FinPLay é uma solução full-stack completa que integra chatbot automatizado 
                    com inteligência artificial, sistema de autenticação seguro e banco de dados 
                    PostgreSQL. O sistema oferece duas modalidades de chat (regras predefinidas e IA), 
                    catálogo visual de 18 produtos em 3 categorias, e sistema completo de pedidos 
                    com histórico persistente.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--cor-texto-secondary)', marginTop: '16px' }}>
                    Versão 1.1.0 inclui autenticação JWT, validações robustas de email e senha, 
                    proteção de rotas, cookies seguros e sistema de pedidos integrado ao banco de dados.
                </p>
            </section>

            {/* NOVIDADES VERSÃO 1.1 */}
            <section className="documentation-section">
                <h2 className="section-title">Novidades da Versão 1.1</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Sistema de Autenticação</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Registro de usuários:</strong> Validação de email com provedores conhecidos 
                            (Gmail, Yahoo, Hotmail, etc.) e senha mínima de 8 caracteres
                        </li>
                        <li className="documentation-list-item">
                            <strong>Login seguro:</strong> JWT tokens com expiração de 24 horas e cookies HTTP-only
                        </li>
                        <li className="documentation-list-item">
                            <strong>Proteção de rotas:</strong> Endpoints protegidos requerem autenticação válida
                        </li>
                        <li className="documentation-list-item">
                            <strong>Sessões persistentes:</strong> LocalStorage + cookies para manter login entre sessões
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Banco de Dados PostgreSQL</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>4 tabelas relacionadas:</strong> users, orders, order_items, sessions
                        </li>
                        <li className="documentation-list-item">
                            <strong>Índices otimizados:</strong> Busca rápida por email, usuário e status
                        </li>
                        <li className="documentation-list-item">
                            <strong>Triggers automáticos:</strong> Atualização de timestamps e limpeza de sessões
                        </li>
                        <li className="documentation-list-item">
                            <strong>Views customizadas:</strong> Histórico de pedidos com agregação automática
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Sistema de Pedidos</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Criar pedidos:</strong> Apenas usuários autenticados podem fazer pedidos
                        </li>
                        <li className="documentation-list-item">
                            <strong>Finalizar pedidos:</strong> Pedidos completos são salvos no histórico permanentemente
                        </li>
                        <li className="documentation-list-item">
                            <strong>Histórico completo:</strong> Consultar todos os pedidos finalizados com detalhes
                        </li>
                        <li className="documentation-list-item">
                            <strong>Cancelar pedidos:</strong> Pedidos pendentes podem ser cancelados
                        </li>
                    </ul>
                </div>
            </section>

            {/* TECNOLOGIAS */}
            <section className="documentation-section">
                <h2 className="section-title">Tecnologias Utilizadas</h2>
                
                <div style={{ marginBottom: '24px' }}>
                    <h3 className="subsection-title">Frontend (React 18)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>React 18.2.0:</strong> Biblioteca JavaScript para interfaces modernas
                        </li>
                        <li className="documentation-list-item">
                            <strong>React Hooks:</strong> useState para estado, useRef para scroll, useEffect para side effects
                        </li>
                        <li className="documentation-list-item">
                            <strong>Fetch API:</strong> Requisições HTTP assíncronas com cookies
                        </li>
                        <li className="documentation-list-item">
                            <strong>LocalStorage:</strong> Persistência de token e dados do usuário
                        </li>
                        <li className="documentation-list-item">
                            <strong>CSS Modules:</strong> Estilização modular com variáveis customizadas
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="subsection-title">Backend (Go 1.21)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Go (Golang):</strong> Linguagem compilada, rápida e com tipagem forte
                        </li>
                        <li className="documentation-list-item">
                            <strong>net/http:</strong> Servidor HTTP nativo para API RESTful
                        </li>
                        <li className="documentation-list-item">
                            <strong>database/sql:</strong> Interface padrão para bancos de dados SQL
                        </li>
                        <li className="documentation-list-item">
                            <strong>lib/pq:</strong> Driver PostgreSQL puro em Go
                        </li>
                        <li className="documentation-list-item">
                            <strong>golang-jwt/jwt:</strong> Geração e validação de JWT tokens
                        </li>
                        <li className="documentation-list-item">
                            <strong>golang.org/x/crypto:</strong> Hash bcrypt para senhas (custo 10)
                        </li>
                        <li className="documentation-list-item">
                            <strong>rs/cors:</strong> Middleware CORS com whitelist de origens
                        </li>
                        <li className="documentation-list-item">
                            <strong>godotenv:</strong> Carregamento seguro de variáveis de ambiente
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="subsection-title">Banco de Dados (PostgreSQL)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>PostgreSQL 18:</strong> Banco relacional open-source de alto desempenho
                        </li>
                        <li className="documentation-list-item">
                            <strong>UUID:</strong> Chaves primárias universalmente únicas
                        </li>
                        <li className="documentation-list-item">
                            <strong>Índices B-tree:</strong> Otimização de consultas por email e foreign keys
                        </li>
                        <li className="documentation-list-item">
                            <strong>Triggers PL/pgSQL:</strong> Atualização automática de timestamps
                        </li>
                        <li className="documentation-list-item">
                            <strong>Views:</strong> Agregação de dados para histórico de pedidos
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="subsection-title">Inteligência Artificial</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Groq API:</strong> Plataforma de inferência ultra-rápida (~0.5s resposta)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Llama 3.1 8B Instant:</strong> Modelo de linguagem com 8 bilhões de parâmetros
                        </li>
                        <li className="documentation-list-item">
                            <strong>Context Management:</strong> Histórico de 10 mensagens mantido em memória
                        </li>
                        <li className="documentation-list-item">
                            <strong>Intent Detection:</strong> Detecção automática de intenções do usuário
                        </li>
                    </ul>
                </div>
            </section>

            {/* ARQUITETURA */}
            <section className="documentation-section">
                <h2 className="section-title">Arquitetura do Sistema</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Camada de Apresentação (Frontend)</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', lineHeight: '1.7' }}>
                        Interface React com 7 componentes principais: Login, Register, Sidebar, Documentation, 
                        ChatInterface, ChatGPTInterface. Sistema de roteamento baseado em estado de autenticação, 
                        redirecionamento automático, validações em tempo real e feedback visual para usuário.
                    </p>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Camada de Serviços (Backend)</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', lineHeight: '1.7' }}>
                        API RESTful modular em Go com 4 camadas: Handlers (endpoints), Models (lógica de negócio), 
                        Middleware (autenticação JWT), Database (conexão PostgreSQL). Implementa validações,
                        tratamento de erros, logging detalhado e CORS configurado.
                    </p>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Camada de Dados (PostgreSQL)</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', lineHeight: '1.7' }}>
                        Banco relacional com 4 tabelas normalizadas, relacionamentos com foreign keys e cascade, 
                        índices otimizados para queries frequentes, triggers para manutenção automática e views 
                        para agregação de dados complexos.
                    </p>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Camada de IA (Groq)</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', lineHeight: '1.7' }}>
                        Serviço externo de inferência que processa mensagens com contexto personalizado. Sistema 
                        envia prompt definindo comportamento do assistente, mantém histórico de conversação e 
                        retorna respostas contextualizadas em linguagem natural.
                    </p>
                </div>
            </section>

            {/* SEGURANÇA */}
            <section className="documentation-section">
                <h2 className="section-title">Segurança Implementada</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Autenticação e Autorização</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>JWT Tokens:</strong> Assinados com HS256, expiração de 24 horas, secret configurável
                        </li>
                        <li className="documentation-list-item">
                            <strong>Hash de Senhas:</strong> Bcrypt com custo 10 (2^10 iterações = 1024)
                        </li>
                        <li className="documentation-list-item">
                            <strong>HTTP-Only Cookies:</strong> Não acessível via JavaScript, protege contra XSS
                        </li>
                        <li className="documentation-list-item">
                            <strong>CORS Configurado:</strong> Whitelist de origens, credentials habilitado
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Validações</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Email:</strong> Regex para formato + whitelist de provedores (Gmail, Yahoo, etc.)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Senha:</strong> Mínimo 8 caracteres, validação no cliente e servidor
                        </li>
                        <li className="documentation-list-item">
                            <strong>SQL Injection:</strong> Queries parametrizadas com placeholders ($1, $2, etc.)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Input Sanitization:</strong> TrimSpace, validação de tipos, limites de tamanho
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Proteções Adicionais</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Middleware de Auth:</strong> Valida token em todas as rotas protegidas
                        </li>
                        <li className="documentation-list-item">
                            <strong>Tratamento de Erros:</strong> Mensagens genéricas, logs detalhados só no servidor
                        </li>
                        <li className="documentation-list-item">
                            <strong>Connection Pool:</strong> Limite de 25 conexões abertas, 5 idle
                        </li>
                        <li className="documentation-list-item">
                            <strong>Environment Variables:</strong> Credenciais nunca hardcoded, apenas em .env
                        </li>
                    </ul>
                </div>
            </section>

            {/* API ENDPOINTS */}
            <section className="documentation-section">
                <h2 className="section-title">API Endpoints</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Públicos (Sem Autenticação)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>POST /api/auth/register:</strong> Cadastro de novo usuário
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/auth/login:</strong> Login com email e senha
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/auth/logout:</strong> Logout (remove cookie)
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/chat:</strong> Chat com IA (Groq)
                        </li>
                        <li className="documentation-list-item">
                            <strong>GET /health:</strong> Health check do servidor
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Protegidos (Requer JWT Token)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>GET /api/auth/me:</strong> Retorna dados do usuário autenticado
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/orders:</strong> Criar novo pedido
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/orders/complete?id=uuid:</strong> Finalizar pedido
                        </li>
                        <li className="documentation-list-item">
                            <strong>GET /api/orders/history:</strong> Buscar histórico de pedidos
                        </li>
                        <li className="documentation-list-item">
                            <strong>POST /api/orders/cancel?id=uuid:</strong> Cancelar pedido pendente
                        </li>
                    </ul>
                </div>
            </section>

            {/* BANCO DE DADOS */}
            <section className="documentation-section">
                <h2 className="section-title">Estrutura do Banco de Dados</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Tabela: users</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', marginBottom: '8px' }}>
                        Armazena informações dos usuários cadastrados.
                    </p>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>id:</strong> UUID (chave primária)
                        </li>
                        <li className="documentation-list-item">
                            <strong>email:</strong> VARCHAR(255) UNIQUE NOT NULL
                        </li>
                        <li className="documentation-list-item">
                            <strong>password_hash:</strong> VARCHAR(255) NOT NULL (bcrypt)
                        </li>
                        <li className="documentation-list-item">
                            <strong>full_name:</strong> VARCHAR(255)
                        </li>
                        <li className="documentation-list-item">
                            <strong>created_at, updated_at, last_login:</strong> TIMESTAMP
                        </li>
                        <li className="documentation-list-item">
                            <strong>is_active:</strong> BOOLEAN (default true)
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Tabela: orders</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', marginBottom: '8px' }}>
                        Registra os pedidos realizados pelos usuários.
                    </p>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>id:</strong> UUID (chave primária)
                        </li>
                        <li className="documentation-list-item">
                            <strong>user_id:</strong> UUID (FK → users.id, CASCADE)
                        </li>
                        <li className="documentation-list-item">
                            <strong>status:</strong> VARCHAR(50) (pending/completed/cancelled)
                        </li>
                        <li className="documentation-list-item">
                            <strong>total_items:</strong> INTEGER
                        </li>
                        <li className="documentation-list-item">
                            <strong>created_at, completed_at:</strong> TIMESTAMP
                        </li>
                        <li className="documentation-list-item">
                            <strong>notes:</strong> TEXT (observações do cliente)
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Tabela: order_items</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', marginBottom: '8px' }}>
                        Detalha os itens de cada pedido.
                    </p>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>id:</strong> UUID (chave primária)
                        </li>
                        <li className="documentation-list-item">
                            <strong>order_id:</strong> UUID (FK → orders.id, CASCADE)
                        </li>
                        <li className="documentation-list-item">
                            <strong>product_name:</strong> VARCHAR(255)
                        </li>
                        <li className="documentation-list-item">
                            <strong>product_category:</strong> VARCHAR(100) (hamburguer/bebidas/sobremesas)
                        </li>
                        <li className="documentation-list-item">
                            <strong>quantity:</strong> INTEGER (quantidade do produto)
                        </li>
                        <li className="documentation-list-item">
                            <strong>price:</strong> DECIMAL(10,2) (valor unitário)
                        </li>
                        <li className="documentation-list-item">
                            <strong>ingredients:</strong> TEXT (JSON string com ingredientes)
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Tabela: sessions (Opcional)</h3>
                    <p style={{ color: 'var(--cor-texto-secondary)', marginBottom: '8px' }}>
                        Controle de sessões ativas no servidor.
                    </p>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>id:</strong> UUID (chave primária)
                        </li>
                        <li className="documentation-list-item">
                            <strong>user_id:</strong> UUID (FK → users.id, CASCADE)
                        </li>
                        <li className="documentation-list-item">
                            <strong>token:</strong> VARCHAR(500) UNIQUE
                        </li>
                        <li className="documentation-list-item">
                            <strong>expires_at:</strong> TIMESTAMP (validade do token)
                        </li>
                        <li className="documentation-list-item">
                            <strong>ip_address:</strong> VARCHAR(50), <strong>user_agent:</strong> TEXT
                        </li>
                    </ul>
                </div>
            </section>

            {/* FLUXOS DO SISTEMA */}
            <section className="documentation-section">
                <h2 className="section-title">Fluxos do Sistema</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Fluxo de Autenticação</h3>
                    <ol className="documentation-list">
                        <li className="documentation-list-item">
                            Usuário acessa aplicação → Redirecionado para Login
                        </li>
                        <li className="documentation-list-item">
                            Preenche email e senha → Validações frontend (formato, tamanho)
                        </li>
                        <li className="documentation-list-item">
                            POST /api/auth/login → Backend valida credenciais
                        </li>
                        <li className="documentation-list-item">
                            Busca usuário no PostgreSQL → Compara hash bcrypt
                        </li>
                        <li className="documentation-list-item">
                            Gera JWT token (24h) → Define HTTP-only cookie
                        </li>
                        <li className="documentation-list-item">
                            Retorna token + dados do usuário → Frontend salva em LocalStorage
                        </li>
                        <li className="documentation-list-item">
                            Usuário autenticado → Acessa aplicação completa
                        </li>
                        <li className="documentation-list-item">
                            Requisições protegidas → Envia token no header Authorization
                        </li>
                    </ol>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Fluxo de Cadastro</h3>
                    <ol className="documentation-list">
                        <li className="documentation-list-item">
                            Clica em "Cadastre-se" → Formulário de registro
                        </li>
                        <li className="documentation-list-item">
                            Preenche nome, email, senha → Validações: email provedor válido, senha 8+ chars
                        </li>
                        <li className="documentation-list-item">
                            POST /api/auth/register → Backend valida dados
                        </li>
                        <li className="documentation-list-item">
                            Gera hash bcrypt da senha → Insere no PostgreSQL
                        </li>
                        <li className="documentation-list-item">
                            Retorna erro se email já existe → Ou sucesso com token
                        </li>
                        <li className="documentation-list-item">
                            Login automático → Usuário já autenticado
                        </li>
                    </ol>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Fluxo de Pedidos</h3>
                    <ol className="documentation-list">
                        <li className="documentation-list-item">
                            Usuário navega catálogo → Clica "Adicionar ao pedido"
                        </li>
                        <li className="documentation-list-item">
                            POST /api/orders com token → Backend valida autenticação
                        </li>
                        <li className="documentation-list-item">
                            Cria pedido (status: pending) → Insere itens relacionados
                        </li>
                        <li className="documentation-list-item">
                            Retorna ID do pedido → Frontend exibe confirmação
                        </li>
                        <li className="documentation-list-item">
                            Usuário clica "Finalizar" → POST /api/orders/complete?id=uuid
                        </li>
                        <li className="documentation-list-item">
                            Atualiza status para completed → Define completed_at = now()
                        </li>
                        <li className="documentation-list-item">
                            Pedido salvo no histórico → Acessível via GET /api/orders/history
                        </li>
                    </ol>
                </div>
            </section>

            {/* VALIDAÇÕES */}
            <section className="documentation-section">
                <h2 className="section-title">Validações Implementadas</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Email</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Formato:</strong> Regex {'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'}
                        </li>
                        <li className="documentation-list-item">
                            <strong>Provedores válidos:</strong> Gmail, Yahoo, Hotmail, Outlook, Live, iCloud, Protonmail, AOL
                        </li>
                        <li className="documentation-list-item">
                            <strong>Domínios aceitos:</strong> .com, .com.br, .net, .org
                        </li>
                        <li className="documentation-list-item">
                            <strong>Unicidade:</strong> Verificação no banco (constraint UNIQUE)
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Senha</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Tamanho mínimo:</strong> 8 caracteres
                        </li>
                        <li className="documentation-list-item">
                            <strong>Hash:</strong> Bcrypt com custo 10 (1024 rounds)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Armazenamento:</strong> Nunca em texto plano, apenas hash
                        </li>
                        <li className="documentation-list-item">
                            <strong>Comparação:</strong> bcrypt.CompareHashAndPassword
                        </li>
                    </ul>
                </div>
            </section>


            {/* CATÁLOGO */}
            <section className="documentation-section">
                <h2 className="section-title">Catálogo de Produtos</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title"> Hambúrgueres (6 produtos)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Cheese:</strong> Clássico com queijo cheddar
                        </li>
                        <li className="documentation-list-item">
                            <strong>Vegano:</strong> Hambúrguer de grão-de-bico
                        </li>
                        <li className="documentation-list-item">
                            <strong>Recheado:</strong> Recheado com queijo e bacon
                        </li>
                        <li className="documentation-list-item">
                            <strong>Gourmet:</strong> Hambúrguer angus com queijo brie
                        </li>
                        <li className="documentation-list-item">
                            <strong>Picanha:</strong> Hambúrguer de picanha premium
                        </li>
                        <li className="documentation-list-item">
                            <strong>Frango Grelhado:</strong> Peito de frango saudável
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Bebidas (6 produtos)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Caipirinha:</strong> Cachaça, limão, açúcar, gelo
                        </li>
                        <li className="documentation-list-item">
                            <strong>Negroni:</strong> Gin, vermute rosso, Campari
                        </li>
                        <li className="documentation-list-item">
                            <strong>Margarita:</strong> Tequila, Cointreau, limão
                        </li>
                        <li className="documentation-list-item">
                            <strong>Água, Coca Cola, Suco de Laranja:</strong> Opções sem álcool
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Sobremesas (6 produtos)</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Pudim:</strong> Pudim de leite com calda
                        </li>
                        <li className="documentation-list-item">
                            <strong>Cheesecake:</strong> Cheesecake de frutas vermelhas
                        </li>
                        <li className="documentation-list-item">
                            <strong>Sorbet:</strong> Sorbet refrescante de limão
                        </li>
                        <li className="documentation-list-item">
                            <strong>Mousse:</strong> Mousse cremoso de maracujá
                        </li>
                        <li className="documentation-list-item">
                            <strong>Açaí:</strong> Açaí puro 500g
                        </li>
                        <li className="documentation-list-item">
                            <strong>Pavê:</strong> Pavê tradicional de chocolate
                        </li>
                    </ul>
                </div>
            </section>

            {/* ESTATÍSTICAS */}
            <section className="documentation-section">
                <h2 className="section-title">Estatísticas do Projeto</h2>
                
                <div className="feature-card">
                    <h3 className="feature-title">Métricas de Código</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Backend Go:</strong> ~2.500 linhas de código
                        </li>
                        <li className="documentation-list-item">
                            <strong>Frontend React:</strong> ~1.800 linhas de código
                        </li>
                        <li className="documentation-list-item">
                            <strong>SQL:</strong> ~150 linhas (schema + views + triggers)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Total de arquivos:</strong> 35+ arquivos
                        </li>
                    </ul>
                </div>

                <div className="feature-card">
                    <h3 className="feature-title">Componentes</h3>
                    <ul className="documentation-list">
                        <li className="documentation-list-item">
                            <strong>Componentes React:</strong> 7 (Login, Register, Sidebar, Docs, 2 Chats, App)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Endpoints API:</strong> 11 (5 públicos + 6 protegidos)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Tabelas PostgreSQL:</strong> 4 (users, orders, order_items, sessions)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Models Go:</strong> 2 (User, Order)
                        </li>
                        <li className="documentation-list-item">
                            <strong>Serviços Frontend:</strong> 3 (api, auth, order)
                        </li>
                    </ul>
                </div>
            </section>

            {/* RODAPÉ */}
            <section style={{ 
                marginTop: '60px', 
                paddingTop: '24px', 
                borderTop: '1px solid var(--cor-border)',
                textAlign: 'center'
            }}>
                <p style={{ 
                    fontSize: '18px', 
                    lineHeight: '1.7', 
                    color: 'var(--cor-accent-primary)',
                    fontWeight: '600',
                    marginBottom: '16px'
                }}>
                     Versão 1.1.0 - Sistema Completo!
                </p>
                <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.7', 
                    color: 'var(--cor-texto-secondary)',
                    marginBottom: '8px'
                }}>
                    Sistema profissional de chatbot com autenticação JWT, banco de dados PostgreSQL, 
                    catálogo visual interativo e sistema completo de pedidos.
                </p>
                <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--cor-texto-secondary)',
                    marginTop: '24px',
                    opacity: '0.7'
                }}>
                    Desenvolvido com ❤️ usando React, Go, PostgreSQL e Groq AI
                </p>
            </section>
        </div>
    );
};
export default Documentation;
