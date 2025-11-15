import React from 'react';
import { FileNode } from './Sidebar';
import './Editor.css'; // <-- Import component styles

// ... rest of the component code is unchanged
interface EditorProps {
  file: FileNode;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  const isNoteFile = file.name.endsWith('.note');
  
  return (
    <div className="editor-container">
      <div className="editor-header">
        Editing: {file.name}
      </div>
      <div className="editor-content">
        {isNoteFile ? (
          <textarea 
            placeholder={`Type '/' for commands...`} 
            defaultValue={`This is the content for ${file.name}.`}
          />
        ) : (
          <pre>
            <code>
              {`// Code editor for ${file.name}\n// Syntax highlighting coming soon!`}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default Editor;