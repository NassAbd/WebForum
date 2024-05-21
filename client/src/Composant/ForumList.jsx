import React, { useState, useEffect } from 'react';
import './CSS/ForumList.css';
import { useNavigate } from 'react-router-dom';



// Affichage d'une liste de forums

// Composant StatusMessage
const StatusMessage = ({ error, errorClassName, errorMessage, loading, loadingMessage, nothing, nothingMessage, nothingClassName, type }) => {
    if (loading) {
        return <div>{loadingMessage}</div>;
    }
    if (error) {
        return <div className={errorClassName} style={{ color: 'red' }}>{errorMessage}</div>;
    }
    if (nothing) {
        return <div className={nothingClassName}>{nothingMessage}</div>;
    }
    return null;
};


const ForumList = ({ isLoading, forums, error, admin}) => {  // admin indique si on rend la liste des forums ouverts ou fermés
    const [forumCardList, setForumCardList] = useState([]);
    const navigate = useNavigate();

useEffect(() => {
    if (!error && forums && !isLoading) {
        setForumCardList(forums);
    }
}, [error, forums, isLoading]);
    
if (error || !forums || isLoading || forums.length === 0) {
    return (
        <StatusMessage
            error={error || !forums}
            errorClassName="home-error"
            errorMessage={error}
            loading={isLoading}
            loadingMessage="We are fetching the homepage for you"
            nothing={forums && forums.length === 0}
            nothingMessage="No forum to display"
            nothingClassName="home-error"
            type="default"
        />
    );
}


// navigue vers l'URL du forum cliqué
const handleForumClick = (forumId, admin) => {
    console.log("click forum: ", forumId);
    if (!admin){
    navigate(`/forums/${forumId}`);
    }
    else {
        navigate(`/forums-admin/${forumId}`);
    }
};

return (
    <div className="home-container">
        <div className="forum-list">
            {forumCardList.map(forum => (
                <div key={forum._id} className="forum-card" onClick={() => handleForumClick(forum._id, admin)}
                    style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', transition: 'background-color 0.3s' }}> 
                    <div className="forum-header">
                        <p className="username">Username : {JSON.stringify(forum.username)}</p>
                        <p className="date">Date: {JSON.stringify(forum.date)}</p>
                    </div>
                    <p className="subject"><strong>Sujet : </strong> {JSON.stringify(forum.subject)}</p>
                    <div className="content"><strong>Content : </strong>{forum.content.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)}</div>

                
               
            </div>
            ))}
        </div>
    </div>
);


    
};

export default ForumList;
