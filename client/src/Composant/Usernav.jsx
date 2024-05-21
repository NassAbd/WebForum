import React, { useState, useRef } from 'react';
import Avatar from './Avatar';
import { useNavigate, useLocation  } from 'react-router-dom';
import './CSS/Usernav.css';

// CODE DE DAVID
// Naviguer vers son profil, éditer son profil ou se déconnecter

function UserNav({ username,name, avatar, updateConnected, staff}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation(); 

    // Fonction pour naviguer vers le profil de l'utilisateur
    function myProfile() {
        toggleMenu();
        navigate(`/user/${username}`);
    }

    // Fonction pour gérer l'ouverture ou la fermeture du menu
    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    function logout() {
        updateConnected(null, null);
        navigate(`/`);
    }

    function admin() {
        if (location.pathname !== '/admin' && !location.pathname.includes('/forums-admin')){
            navigate(`/admin`);
        }
        else {
            navigate(`/home`);
        }
    }

    // Fermer le menu si l'utilisateur clique en dehors de celui-ci
    function handleOutsideClick(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    }

    // Ajoutez un écouteur d'événement pour fermer le menu lorsque l'utilisateur clique en dehors
    useState(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="userMenu" ref={menuRef}>
            <div className="userMenu-header" >
                <Avatar avatar={avatar} />
                <button 
                className="userMenu-username" 
                style={{ cursor: 'pointer', color: 'blue', border: '1px solid blue', background: 'lightblue'}} 
                onClick={toggleMenu}
            >
                {name || username}
            </button>
            </div>

            {isMenuOpen && (
                <div className="userMenu-dropdown">
                    <div className="userMenu-item" >
                    {staff && location.pathname !== '/admin' && !location.pathname.includes('/forums-admin') && (
                        <button 
                            className="userMenu-item" 
                            style={{ cursor: 'pointer', color: 'black', border: '1px solid black', background: 'lightblack'}} 
                            onClick={admin}
                        >
                            Admin
                        </button>
                    )}
                    {(location.pathname === '/admin' || location.pathname.includes('/forums-admin')) && (
                        <div className="userMenu-item">
                        <button
                            className="userMenu-item"
                            style={{ cursor: 'pointer', color: 'black', border: '1px solid black', background: 'lightblack' }}
                            onClick={admin} // Remplacez par votre action spécifique pour "/admin"
                        >
                            Classique
                        </button>
                        </div>
                    )}
                    </div>
                    <div className="userMenu-item" >
                        <button 
                            className="userMenu-item" 
                            style={{ cursor: 'pointer', color: 'green', border: '1px solid green', background: 'lightgreen'}} 
                            onClick={myProfile}
                        >
                            My profile
                        </button>
                    </div>
                    <div className="userMenu-item" onClick={logout}>
                    <button 
                            className="userMenu-item" 
                            style={{ cursor: 'pointer', color: 'red', border: '1px solid red', background: 'lightred'}} 
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserNav;
