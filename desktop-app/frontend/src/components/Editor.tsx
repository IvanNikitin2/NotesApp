import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FileNode } from './Sidebar';
import { Command, COMMANDS } from '../lib/commands';
import CommandDropdown from './CommandDropdown';
import './Editor.css';
import './EditorCommands.css';

const Editor: React.FC<{ file: FileNode }> = ({ file }) => {
  const [content, setContent] = useState(`# ${file.name}\n\nStart writing your notes here.`);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [isCommandMenuMounted, setCommandMenuMounted] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(`# ${file.name}\n\nStart writing your notes here.`);
    setShowCommandMenu(false);
  }, [file]);

  useEffect(() => {
    if (showCommandMenu) {
      setCommandMenuMounted(true);
    } else {
      const timer = setTimeout(() => setCommandMenuMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [showCommandMenu]);

  const applyCommand = (command: Command) => {
    if (!editorRef.current) return;
    const { selectionStart, selectionEnd, value } = editorRef.current;

    const lineStartIndex = value.lastIndexOf('\n', selectionStart - 1) + 1;
    let textToInsert = '';

    switch (command.id) {
      case 'heading-1': textToInsert = '# '; break;
      case 'heading-2': textToInsert = '## '; break;
      case 'heading-3': textToInsert = '### '; break;
      case 'bullet': textToInsert = '- '; break;
      case 'toggle': textToInsert = '<details>\n  <summary>Toggle Title</summary>\n  \n</details>'; break;
      case 'line': textToInsert = '\n---\n'; break;
      case 'reference': textToInsert = '[Link Text](https://example.com)'; break;
    }

    const newContent = value.substring(0, lineStartIndex) + textToInsert + value.substring(lineStartIndex);
    setContent(newContent);
    setShowCommandMenu(false);

    setTimeout(() => editorRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandMenu) {
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') setSelectedCommandIndex(p => (p > 0 ? p - 1 : COMMANDS.length - 1));
        if (e.key === 'ArrowDown') setSelectedCommandIndex(p => (p < COMMANDS.length - 1 ? p + 1 : 0));
        if (e.key === 'Enter') applyCommand(COMMANDS[selectedCommandIndex]);
        if (e.key === 'Escape') setShowCommandMenu(false);
        return;
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;
    setContent(value);

    const char = value[selectionStart - 1];
    if (char === '/') {
      const { top, left } = editorRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
      // This is a simplified position. A real implementation would need a library to get caret coords.
      setCommandPosition({ top: top + 30, left: left + 15 });
      setShowCommandMenu(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandMenu(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">Editing: {file.name}</div>
      <div className="editor-content-split">
        <textarea
          ref={editorRef}
          value={content}
          onKeyDown={handleKeyDown}
          onChange={handleInput}
          className="editor-textarea"
          spellCheck={false}
        />
        <div className="editor-preview">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div>

        {isCommandMenuMounted && (
          <div style={{ position: 'absolute', ...commandPosition, zIndex: 100 }}>
            <CommandDropdown
              commands={COMMANDS}
              onSelect={applyCommand}
              isVisible={showCommandMenu}
              selectedIndex={selectedCommandIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;