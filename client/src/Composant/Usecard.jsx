import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import './CSS/Usecard.css';

// CODE DE DAVID
// Représentation visuelle des informations d'un utilisateur sous forme de carte

class UserCard extends Component {
  // Implémente le composant Avatar pour afficher l'image de l'avatar de l'utilisateur
  renderAvatar = () => {
    const { avatar } = this.props;

    return (
      <Avatar avatar={avatar} />
      
    );
  };

  render() {
    const { name, username, is_staff} = this.props;

    return (
      <Card className='user-card'>
  {this.renderAvatar()}
  <Card.Content>
    <div className='user-card-header'> {/* Ajoutez la classe user-card-header */}
      <Card.Header className='user-card-name'>{name}</Card.Header>
      <Card.Meta>
        <Link to={`/user/${username}`}>@{username}</Link>
        {is_staff === 'true' && (
          <span className='user-card-staff'> (Staff) </span>
        )}
      </Card.Meta>
    </div>
  </Card.Content>
</Card>
    );
  }
}

export default UserCard;
