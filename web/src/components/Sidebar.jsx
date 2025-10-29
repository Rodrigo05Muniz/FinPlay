import React from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ user, onLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">FinPlay</h2>
                <p className="sidebar-subtitle">Serviços Profissionais</p>
                {user && (
                    <p className="sidebar-user">Olá, {user.full_name || user.email}</p>
                )}
            </div>
            
            <div className="sidebar-menu">
                <div className="sidebar-info">
                    <h3 className="sidebar-info-title">Serviços Disponíveis</h3>
                    <ul className="sidebar-info-list">
                        <li> Pedreiro</li>
                        <li> Pintor</li>
                        <li> Encanador</li>
                        <li> Doméstica</li>
                        <li> Babá</li>
                        <li> Cabeleireira</li>
                        <li> Manicure</li>
                    </ul>
                </div>
                
                <div className="sidebar-features">
                    <h3 className="sidebar-info-title">Funcionalidades</h3>
                    <ul className="sidebar-info-list">
                        <li> Atendimento automatizado</li>
                        <li> Assistente com IA</li>
                        <li> Catálogo interativo</li>
                        <li> Agendamento fácil</li>
                    </ul>
                </div>
            </div>
            
            <div className="sidebar-footer">
                <button
                    className="sidebar-logout-button"
                    onClick={onLogout}
                >
                    <span className="sidebar-icon">🚪</span>
                    <span className="sidebar-text">Sair</span>
                </button>
                <p className="sidebar-version">v2.0.0</p>
            </div>
        </div>
    );
};

export default Sidebar;