import React from 'react';
import './WelcomeScreen.css'; // <-- Import component styles

// ... rest of the component code is unchanged
const WelcomeScreen: React.FC = () => {
  return (
    <div className="welcome-screen">
      <div className="welcome-search-bar">
        <input type="text" placeholder="Search notes..." />
      </div>
      <div className="welcome-widgets">
        <div className="widget">
          <h3>Quick Actions</h3>
          <button>New Note</button>
          <button>New Folder</button>
        </div>
        <div className="widget">
          <h3>Recent Notes</h3>
          <ul>
            <li>Welcome.note</li>
            <li>Installation.note</li>
          </ul>
        </div>
        <div className="widget">
          <h3>Pinned</h3>
          <ul>
            <li>My important task.note</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;