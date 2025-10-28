import React from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ currentPage, onNavigate, user, onLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">FinPlay</h2>
                {user && (
                    <p className="sidebar-user">Olá, {user.full_name || user.email}</p>
                )}
            </div>
            
            <div className="sidebar-menu">
                <button
                    className={`sidebar-button ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => onNavigate('home')}
                >
                    <span className="sidebar-icon">📖</span>
                    <span className="sidebar-text">Documentação</span>
                </button>
                
                <button
                    className={`sidebar-button ${currentPage === 'chat' ? 'active' : ''}`}
                    onClick={() => onNavigate('chat')}
                >
                    <span className="sidebar-icon">💬</span>
                    <span className="sidebar-text">Chat Simples</span>
                </button>
                
                <button
                    className={`sidebar-button ${currentPage === 'chatgpt' ? 'active' : ''}`}
                    onClick={() => onNavigate('chatgpt')}
                >
                    <span className="sidebar-icon">🤖</span>
                    <span className="sidebar-text">Chat GPT</span>
                </button>
            </div>
            
            <div className="sidebar-footer">
                <button
                    className="sidebar-logout-button"
                    onClick={onLogout}
                >
                    <span className="sidebar-icon"></span>
                    <span className="sidebar-text">Sair</span>
                </button>
                <p className="sidebar-version">v1.1.0</p>
            </div>
        </div>
    );
};

export default Sidebar;