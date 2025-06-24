
import React, { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { renderIcon, kebabToPascal } from '@/utils/iconUtils';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // List of common icons that would be useful for a task management app
  const commonIconNames = [
    'briefcase', 'clipboard', 'check-circle', 'calendar',
    'clock', 'code', 'cog', 'database', 'file', 'folder',
    'globe', 'home', 'image', 'layers', 'layout', 'list',
    'mail', 'message-square', 'monitor', 'pen-tool', 
    'pie-chart', 'plus', 'settings', 'star', 'terminal',
    'thumbs-up', 'tool', 'trash-2', 'trending-up',
    'user', 'users', 'zap', 'shield', 'target', 'flag',
    'bookmark', 'lightbulb', 'archive', 'book-open',
    'file-text', 'phone', 'map', 'camera', 'award'
  ];
  
  const filteredIcons = useMemo(() => {
    return commonIconNames
      .filter(iconName => iconName.toLowerCase().includes(search.toLowerCase()))
      .sort();
  }, [search]);
  
  // Get the display name of the selected icon (capitalize for display)
  const getSelectedIconDisplay = () => {
    if (!selectedIcon) return 'Select Icon';
    
    // For kebab-case icon names, format them nicely
    if (selectedIcon.includes('-')) {
      return selectedIcon.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // For camelCase or PascalCase, just capitalize the first letter
    return selectedIcon.charAt(0).toUpperCase() + selectedIcon.slice(1);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {renderIcon(selectedIcon, 'text-foreground', 18)}
            <span>{getSelectedIconDisplay()}</span>
          </div>
          <div className="opacity-50">↓</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          <div className="grid grid-cols-4 gap-2">
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant="ghost"
                className={`h-9 w-full justify-start p-2 ${
                  selectedIcon === iconName ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  onSelectIcon(iconName);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col items-center justify-center text-center w-full">
                  {renderIcon(iconName, selectedIcon === iconName ? 'text-accent-foreground' : 'text-foreground', 16)}
                  <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                </div>
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No icons found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
