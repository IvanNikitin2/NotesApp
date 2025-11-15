import React, { useState } from 'react';
import './Sidebar.css'; // <-- Import component styles

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

interface SidebarProps {
  fileTree: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onGoHome: () => void; // <-- New prop for going home
}

const TreeNode: React.FC<{ node: FileNode; onFileSelect: (file: FileNode) => void; level: number }> = ({ node, onFileSelect, level }) => {
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
        style={{ paddingLeft: `${level * 20 + 8}px` }} // Base padding + level indent
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
  return (
    <>
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
    </>
  );
};

export default Sidebar;