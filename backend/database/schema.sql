-- Criação do banco de dados e tabelas

-- Criar banco de dados (executar como superuser)
-- CREATE DATABASE hello_world_db;

-- Conectar ao banco: \c hello_world_db

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Índice para busca rápida por email
CREATE INDEX idx_users_email ON users(email);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
    total_items INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT
);

-- Índice para busca rápida por usuário
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100) NOT NULL, -- hamburguer, bebidas, sobremesas
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2),
    ingredients TEXT, -- JSON string com ingredientes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para busca rápida por pedido
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Tabela de sessões (opcional, para controle de sessão no servidor)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- Índice para busca rápida por token
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar sessões expiradas (executar periodicamente)
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- View para histórico de pedidos do usuário
CREATE OR REPLACE VIEW user_order_history AS
SELECT 
    o.id as order_id,
    o.user_id,
    u.email,
    o.status,
    o.total_items,
    o.created_at,
    o.completed_at,
    json_agg(
        json_build_object(
            'product_name', oi.product_name,
            'category', oi.product_category,
            'quantity', oi.quantity,
            'ingredients', oi.ingredients
        )
    ) as items
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY o.id, o.user_id, u.email, o.status, o.total_items, o.created_at, o.completed_at
ORDER BY o.completed_at DESC;

-- Dados de exemplo (remover em produção)
-- Senha: "senha123" (hash bcrypt)
INSERT INTO users (email, password_hash, full_name) VALUES 
('teste@gmail.com', '$2a$10$XQ.V5/K5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J', 'Usuário Teste')
ON CONFLICT (email) DO NOTHING;