import React from 'react';
import { Link } from 'react-router-dom';

// CODE DE DAVID
// Barre de navigation simple et stylisée avec des emojis comme icônes

const Navlink = () => {
    // Styles en objets JavaScript
    const navlinkContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f8f9fa',
    };

    const linkStyle = {
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        color: '#007bff',
        textDecoration: 'none',
    };

    // Emoji à la place des icônes
    const icons = {
        home: '🏠',
        users: '👥',
        github: '🐙',
    };

    return (
        <div style={navlinkContainerStyle}>
            <div style={linkStyle}>
                <span>{icons.home}</span>
                <Link to="/home">Home</Link>
            </div>
            <div style={linkStyle}>
                <span>{icons.users}</span>
                <Link to="/users">Users</Link>
            </div>
            <div style={linkStyle}>
                <span>{icons.github}</span>
                <a href="https://github.com/endiliey/rengorum">Contact</a>
            </div>
        </div>
    );
};

export default Navlink;
