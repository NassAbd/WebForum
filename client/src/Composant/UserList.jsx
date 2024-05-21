import React, {Component} from 'react';
import StatusMessage from './StatusMessage';
import UserCard from './Usecard';

// Affichage des utilisateurs sous forme de cartes 

export default class UserList extends Component {
  render() {
    const {isLoading, error, users} = this.props;

    if (error || !users || isLoading || users.length === 0) {
      return (
        <StatusMessage
          error={error || !users}
          errorClassName="users-error"
          errorMessage={error}
          loading={isLoading}
          loadingMessage={`We are fetching the users for you`}
          nothing={users && users.length === 0}
          nothingMessage={`No user to display`}
          nothingClassName="users-error"
          type="default"
        />
      );
    }

    const userCardList = users.map(user => {
      const {name, username, avatar, is_staff} = user;  // récupération des informations nécessaires de chaque utilisateur

      return (
        <div key={username} className="userCard">
          <UserCard
            username={username}
            name={name}
            avatar={avatar}
            is_staff={is_staff}
          />
        </div>
      );
    });
    return <div className="usersContainer">{userCardList}</div>;
  }
}