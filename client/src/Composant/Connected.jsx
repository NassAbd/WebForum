import React from 'react';
import {BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HeaderContainer from './Header';
import Profil from './Profil';
import UsersContainer from './Profils';
import HomeContainer from './Home';
import ForumContainer from './Forum';
import HomeAdmin from './HomeAdmin';
import ForumAdmin from './ForumAdmin';



function Connected({username, staff, updateConnected}) {
    

    return (
        <BrowserRouter>
            <div className="app-layout">
                <HeaderContainer userName={username} updateConnected={updateConnected} staff={staff}/>
                {/* Définition de routes : quand telle URL est atteinte, on affiche tel composant */}
                <Routes>
                    <Route path="/users" element={<UsersContainer />} />
                    <Route path="/admin" element={<HomeAdmin username={username} />} />
                    <Route path="/user/:username" element={<Profil userNameProp={username} staff={staff}/>} />
                    <Route path="/forums/:forum" element={<ForumContainer username={username}/>} />
                    <Route path="/forums-admin/:forum" element={<ForumAdmin username={username}/>} />
                    <Route exact path="/home" element={<HomeContainer username={username} />} />
                    {/* Redirection vers "/home" par défaut */}
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default Connected;
