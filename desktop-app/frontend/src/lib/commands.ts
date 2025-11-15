export interface Command {
  id: string; // Unique ID for each command
  label: string;
  markdown: string; // Icon/character to display
  description: string;
}

export const COMMANDS: Command[] = [
  { 
    id: 'heading-1', 
    label: 'Heading 1', 
    markdown: '#', 
    description: 'Large section heading' 
  },
  { 
    id: 'heading-2', 
    label: 'Heading 2', 
    markdown: '##', 
    description: 'Medium section heading' 
  },
  { 
    id: 'heading-3', 
    label: 'Heading 3', 
    markdown: '###', 
    description: 'Small section heading' 
  },
  { 
    id: 'toggle', 
    label: 'Toggle', 
    markdown: '›', 
    description: 'Create a collapsible section' 
  },
  { 
    id: 'bullet', 
    label: 'Bulletpoint', 
    markdown: '•', 
    description: 'Create a bulleted list item' 
  },
  {
    id: 'reference',
    label: 'Reference',
    markdown: '🔗',
    description: 'Insert a hyperlink',
  },
  { 
    id: 'line', 
    label: 'Line', 
    markdown: '—', 
    description: 'Insert a horizontal rule' 
  },
];