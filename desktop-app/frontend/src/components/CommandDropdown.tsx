import React, { useEffect, useState } from 'react';
import './CommandDropdown.css';

export interface Command {
  label: string;
  markdown: string;
  description?: string;
}

interface CommandDropdownProps {
  commands: Command[];
  onSelect: (command: Command) => void;
  isVisible: boolean;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({ commands, onSelect, isVisible }) => {
  const [isAnimatingIn, setAnimatingIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Use a timeout to allow the component to mount before adding the visible class
      const timer = setTimeout(() => setAnimatingIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimatingIn(false);
    }
  }, [isVisible]);

  return (
    <div className={`command-dropdown ${isAnimatingIn ? 'visible' : ''}`}>
      <ul>
        {commands.map((command) => (
          <li
            key={command.label}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(command);
            }}
          >
            <div className="command-icon">{command.markdown}</div>
            <div className="command-details">
              <div className="command-label">{command.label}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandDropdown;