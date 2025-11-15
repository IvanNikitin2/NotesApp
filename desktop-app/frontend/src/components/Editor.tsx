import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileNode } from './Sidebar';
import CommandDropdown, { Command } from './CommandDropdown';
import './Editor.css';

const COMMANDS: Command[] = [
  { label: 'Heading 1', markdown: '#' },
  { label: 'Heading 2', markdown: '##' },
  { label: 'Heading 3', markdown: '###' },
];

const getLineClass = (line: string): string => {
  if (line.startsWith('# ')) return 'h1';
  if (line.startsWith('## ')) return 'h2';
  if (line.startsWith('### ')) return 'h3';
  return 'p';
};

interface EditorProps {
  file: FileNode;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  const isNoteFile = file.name.endsWith('.note');
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(`This is the content for ${file.name}.`);
  
  // --- Command Menu State ---
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [isCommandMenuMounted, setCommandMenuMounted] = useState(false);
  const [commandLineIndex, setCommandLineIndex] = useState<number | null>(null);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  useEffect(() => {
    setContent(`This is the content for ${file.name}.`);
    setShowCommandMenu(false);
    setCommandLineIndex(null);
  }, [file]);

  useEffect(() => {
    if (showCommandMenu) {
      setCommandMenuMounted(true);
    } else {
      const timer = setTimeout(() => {
        setCommandMenuMounted(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showCommandMenu]);

  const getCaretLineIndex = (): number | null => {
    const sel = window.getSelection();
    if (!sel || !editorRef.current) return null;

    let node: Node | null = sel.anchorNode;
    while (node && node.parentElement !== editorRef.current) {
      node = node.parentNode;
    }
    if (!node) return null;

    return Array.from(editorRef.current.children).indexOf(node as Element);
  };

  const applyCommand = useCallback((command: Command) => {
    const lineIndex = commandLineIndex ?? getCaretLineIndex();
    if (lineIndex === null || !editorRef.current) return;

    const lineDiv = editorRef.current.children[lineIndex] as HTMLDivElement;
    lineDiv.className = `editor-line ${getLineClass(command.markdown + ' ')}`;
    // Replace the entire line content, including the trigger `/`
    lineDiv.innerText = ''; 

    setShowCommandMenu(false);

    // Move caret to end and focus the line
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(lineDiv);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
    lineDiv.focus();
  }, [commandLineIndex]);

  const handleInput = () => {
    if (!editorRef.current) return;

    const newContent = Array.from(editorRef.current.children)
      .map((c) => (c as HTMLDivElement).innerText)
      .join('\n');
    setContent(newContent);

    const lineIndex = getCaretLineIndex();
    if (lineIndex === null) {
      setShowCommandMenu(false);
      return;
    }

    const lineText = (editorRef.current.children[lineIndex] as HTMLDivElement).innerText;
    // Show menu if line contains '/' - can be expanded for filtering
    if (lineText.includes('/')) {
      setShowCommandMenu(true);
      setCommandLineIndex(lineIndex);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showCommandMenu) {
      // These keys are for navigation only and should not affect the editor
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') {
        setSelectedCommandIndex((prev) => (prev === 0 ? COMMANDS.length - 1 : prev - 1));
        return;
      }
      if (e.key === 'ArrowDown') {
        setSelectedCommandIndex((prev) => (prev === COMMANDS.length - 1 ? 0 : prev + 1));
        return;
      }
      if (e.key === 'Enter') {
        applyCommand(COMMANDS[selectedCommandIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setShowCommandMenu(false);
        return;
      }
      // All other keys will be handled by the editor by default
    }
    
    // Default behavior for 'Enter' on headings (only if menu is closed)
    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel || !editorRef.current) return;
      const lineDiv = sel.anchorNode?.parentElement as HTMLDivElement;
      if (!lineDiv) return;

      if (lineDiv.classList.contains('h1') || lineDiv.classList.contains('h2') || lineDiv.classList.contains('h3')) {
        setTimeout(() => {
          const nextLine = lineDiv.nextElementSibling as HTMLDivElement;
          if (nextLine) {
            nextLine.className = 'editor-line p';
          }
        }, 0);
      }
    }
  };

  const getCaretYPosition = (container: HTMLElement | null): number => {
    if (!container) return 0;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;

    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);

    const tempSpan = document.createElement('span');
    range.insertNode(tempSpan);

    const rect = tempSpan.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const y = rect.top - containerRect.top + container.scrollTop;

    tempSpan.parentNode?.removeChild(tempSpan);

    return y;
  };

  return (
    <div className="editor-container">
      <div className="editor-header">Editing: {file.name}</div>
      <div className="editor-content">
        {isNoteFile ? (
          <div className="note-editor-grid" style={{ position: 'relative' }}>
            <div
              className="editor-display"
              ref={editorRef}
              contentEditable
              spellCheck={false}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              suppressContentEditableWarning
            ></div>

            {isCommandMenuMounted && commandLineIndex !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: getCaretYPosition(editorRef.current),
                  left: 0,
                  zIndex: 100,
                }}
              >
                <CommandDropdown 
                  commands={COMMANDS} 
                  onSelect={applyCommand}
                  isVisible={showCommandMenu}
                  selectedIndex={selectedCommandIndex}
                />
              </div>
            )}
          </div>
        ) : (
          <pre>
            <code>{`// Code editor for ${file.name}\n// Syntax highlighting coming soon!`}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default Editor;