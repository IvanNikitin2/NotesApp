import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Sidebar.css';

// --- Constants for resizing behavior ---
const MIN_WIDTH = 180;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 260;
const COLLAPSE_THRESHOLD = 100;

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

interface SidebarProps {
  fileTree: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onGoHome: () => void;
}

const TreeNode: React.FC<{ node: FileNode; onFileSelect: (file: FileNode) => void; level: number }> = ({ node, onFileSelect, level }) => {
    // ... TreeNode component remains the same
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = node.type === 'folder';
    const handleToggle = () => {
      if (isFolder) {
        setIsOpen(!isOpen);
      } else {
        onFileSelect(node);
      }
    };
    return (
      <div>
        <div 
          className={`tree-node ${isFolder ? 'folder' : 'file'}`} 
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={handleToggle}
        >
          {isFolder && <span className={`arrow ${isOpen ? 'open' : ''}`}>›</span>}
          <span className="node-name">{node.name}</span>
        </div>
        {isFolder && isOpen && node.children && (
          <div className="tree-node-children">
            {node.children.map(child => (
              <TreeNode key={child.path} node={child} onFileSelect={onFileSelect} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ fileTree, onFileSelect, onGoHome }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    const shouldOpen = !isSidebarOpen;
    setSidebarOpen(shouldOpen);
    if (shouldOpen) {
      setSidebarWidth(DEFAULT_WIDTH);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.classList.add('resizing');
  };

  const handleMouseUp = useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      document.body.classList.remove('resizing');
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !sidebarRef.current || !resizerRef.current || !toggleButtonRef.current) return;

    if (e.clientX < COLLAPSE_THRESHOLD) {
      setSidebarOpen(false);
      handleMouseUp();
      return;
    }
    
    const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
    sidebarRef.current.style.width = `${newWidth}px`;
    resizerRef.current.style.left = `${newWidth - 4}px`;
    toggleButtonRef.current.style.left = `${newWidth - 48}px`;
  }, [handleMouseUp]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sidebar-container ${isSidebarOpen ? '' : 'closed'}`}
        style={{ width: `${sidebarWidth}px`, marginLeft: isSidebarOpen ? 0 : `-${sidebarWidth + 1}px` }}
      >
        <div className="sidebar-header">
          <button className="home-button" onClick={onGoHome}>
            My Notes App
          </button>
        </div>
        
        <div className="file-tree">
          {fileTree.map(node => (
            <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} level={0} />
          ))}
        </div>
      </div>
      
      <button 
        ref={toggleButtonRef}
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        style={{ left: isSidebarOpen ? `${sidebarWidth - 48}px` : '15px' }}
      >
        {isSidebarOpen ? '«' : '»'}
      </button>

      <div 
        ref={resizerRef}
        className="resizer" 
        onMouseDown={handleMouseDown}
        style={{ left: isSidebarOpen ? `${sidebarWidth - 4}px` : '-10px' }}
      />
    </>
  );
};

export default Sidebar;