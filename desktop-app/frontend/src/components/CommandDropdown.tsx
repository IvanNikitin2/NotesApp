import React, { useEffect, useState, useRef } from 'react';
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
  selectedIndex: number;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({ commands, onSelect, isVisible, selectedIndex }) => {
  const [isAnimatingIn, setAnimatingIn] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimatingIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimatingIn(false);
    }
  }, [isVisible]);

  // Scroll the selected item into view
  useEffect(() => {
    if (isVisible && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLLIElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, isVisible]);

  return (
    <div className={`command-dropdown ${isAnimatingIn ? 'visible' : ''}`}>
      <ul ref={listRef}>
        {commands.map((command, index) => (
          <li
            key={command.label}
            className={index === selectedIndex ? 'active' : ''}
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