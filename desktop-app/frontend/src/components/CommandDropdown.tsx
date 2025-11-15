import React from 'react';
import './CommandDropdown.css';

export interface Command {
  label: string;
  markdown: string;
  description: string;
}

interface CommandDropdownProps {
  commands: Command[];
  onSelect: (command: Command) => void;
  placeholder?: string;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({ commands, onSelect }) => {
  return (
    <div className="command-dropdown">
      <ul>
        {commands.map((command) => (
          <li
            key={command.label}
            onMouseDown={(e) => {
              e.preventDefault(); // prevent editor losing focus
              onSelect(command);
            }}
          >
            <div className="command-icon">{command.markdown}</div>
            <div className="command-details">
              <div className="command-label">{command.label}</div>
              <div className="command-description">{command.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandDropdown;
