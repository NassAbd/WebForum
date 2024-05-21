import React from 'react';

// CODE DE DAVID
// Affiche l'avatar d'un utilisateur à partir d'une URL spécifiée

class Avatar extends React.Component {


  render() {
    const { avatar } = this.props;

    return (
        <img
            src={avatar}
            className="avatar"
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
            }}
            onError={() => console.error('Erreur de chargement de l\'image')}
        />
    );
}
}

export default Avatar;
