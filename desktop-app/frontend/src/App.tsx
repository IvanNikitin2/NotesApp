import React, { useState } from 'react';
import Sidebar, { FileNode } from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import Editor from './components/Editor';
import './App.css'; // <-- Import component styles

const initialFileTree: FileNode[] = [
  {
    name: 'Getting Started',
    type: 'folder',
    path: '/getting-started',
    children: [
      { name: 'Welcome.note', type: 'file', path: '/getting-started/welcome.note' },
      { name: 'Installation.note', type: 'file', path: '/getting-started/installation.note' },
    ],
  },
  {
    name: 'Project Files',
    type: 'folder',
    path: '/project-files',
    children: [
      { name: 'ideas.note', type: 'file', path: '/project-files/ideas.note' },
      { name: 'ui-mockup.js', type: 'file', path: '/project-files/ui-mockup.js' },
    ],
  },
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [fileTree] = useState<FileNode[]>(initialFileTree);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const handleGoHome = () => {
    setSelectedFile(null);
  };

  return (
    <div className="app-container">
      <div className={`sidebar-container ${isSidebarOpen ? '' : 'closed'}`}>
        <Sidebar 
          fileTree={fileTree} 
          onFileSelect={setSelectedFile}
          onGoHome={handleGoHome} 
        />
      </div>

      <button 
        className={`sidebar-toggle ${isSidebarOpen ? '' : 'closed'}`} 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? '«' : '»'}
      </button>

      <main className="content">
        {selectedFile ? (
          <Editor file={selectedFile} />
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
}

export default App;