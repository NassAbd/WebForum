import React from 'react';
import { Editor } from 'draft-js';

// CODE DE DAVID
// Personnalisation facile à travers les props

const RichEditor = ({
  placeholder,
  editorState,
  wrapperClassName,
  toolbarClassName,
  editorClassName,
  onEditorStateChange,
  handleBeforeInput,
  handlePastedText,
}) => {
  return (
    <div className={wrapperClassName}>
      <Editor
        editorState={editorState}
        onChange={onEditorStateChange}
        handleBeforeInput={handleBeforeInput}
        handlePastedText={handlePastedText}
        placeholder={placeholder}
        className={editorClassName}
      />
    </div>
  );
};

export default RichEditor;
