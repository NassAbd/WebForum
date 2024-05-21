import React from 'react';
import { Message, Link } from 'semantic-ui-react';

// CODE DE DAVID
// Afficher des messages d'erreur ou de succès

const StatusMessage = ({ error, errorClassName, errorMessage, success, successClassName, successMessage, type }) => {
  if (error) {
    return (
      <Message
        error
        className={errorClassName}
        content={errorMessage}
      />
    );
  }

  if (success) {
    return (
      <Message
        success
        className={successClassName}
        content={successMessage}
      />
    );
  }

  return null;
};

export default StatusMessage;
