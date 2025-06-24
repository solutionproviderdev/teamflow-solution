
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

// Available icons for users
export const userIcons: IconName[] = [
  'User', 'UserCog', 'UserCircle', 'Users', 'UserCheck', 
  'Briefcase', 'Brain', 'Code', 'CodeXml', 'Cog', 
  'Database', 'FileCode', 'Glasses', 'Laptop', 'PenTool', 
  'Palette', 'Pencil', 'Headphones', 'Coffee'
];

// Available icons for projects
export const projectIcons: IconName[] = [
  'FolderKanban', 'Folder', 'FolderOpen', 'Globe', 'Laptop',
  'LayoutGrid', 'Layers', 'Lightbulb', 'Rocket', 'Shield',
  'Smartphone', 'Star', 'Target', 'Trophy', 'Building', 
  'Briefcase', 'Boxes', 'BookOpen', 'Landmark'
];

// Available icons for tasks
export const taskIcons: IconName[] = [
  'CheckSquare', 'ClipboardCheck', 'FileText', 'ListChecks', 'ListTodo',
  'Lock', 'PenTool', 'Terminal', 'Wrench', 'Zap',
  'Code', 'FileCode', 'Settings', 'Image', 'LayoutGrid',
  'MessageSquare', 'Pencil', 'Search', 'BookOpen', 'PieChart'
];

// Convert kebab-case to PascalCase for Lucide icons
export const kebabToPascal = (kebab: string): string => {
  return kebab
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Function to render an icon by name
export const renderIcon = (
  iconName: IconName | string, 
  className?: string,
  size?: number
): React.ReactNode => {
  let effectiveIconName: string;
  
  // Handle kebab-case icon names from older parts of the app
  if (iconName.includes('-')) {
    effectiveIconName = kebabToPascal(iconName);
  } else {
    // For direct PascalCase names or lowercase names that need conversion
    effectiveIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  }
  
  // Check if the transformed icon name exists in LucideIcons
  if (effectiveIconName in LucideIcons) {
    const Icon = LucideIcons[effectiveIconName as IconName] as LucideIcon;
    return <Icon className={className} size={size || 20} />;
  }
  
  // Fallback to a default icon
  console.warn(`Icon not found: ${iconName} (transformed to ${effectiveIconName})`);
  return <LucideIcons.HelpCircle className={className} size={size || 20} />;
};

// Component to display an icon selection
export interface IconSelectProps {
  iconList: IconName[];
  selectedIcon: IconName | string;
  onSelect: (iconName: IconName) => void;
}

export const IconSelect: React.FC<IconSelectProps> = ({ 
  iconList, 
  selectedIcon, 
  onSelect 
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2">
      {iconList.map((iconName) => (
        <div
          key={iconName}
          className={`p-3 cursor-pointer rounded-md hover:bg-accent transition-colors flex items-center justify-center ${
            selectedIcon === iconName ? 'bg-primary/10 border border-primary/30' : ''
          }`}
          onClick={() => onSelect(iconName)}
        >
          {renderIcon(iconName, 'text-foreground')}
        </div>
      ))}
    </div>
  );
};
