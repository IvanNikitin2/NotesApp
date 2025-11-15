import React, { useEffect, useState, useRef } from 'react';
import { Command } from '../lib/commands';
import './CommandDropdown.css';

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
            key={command.id}
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