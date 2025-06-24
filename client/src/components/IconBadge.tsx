
import React from 'react';
import { cn } from '@/lib/utils';
import { renderIcon } from '@/utils/iconUtils';

interface IconBadgeProps {
  iconName: string;
  className?: string;
  size?: number;
  label?: string;
}

const IconBadge: React.FC<IconBadgeProps> = ({ 
  iconName, 
  className, 
  size = 16,
  label
}) => {
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-medium',
      className
    )}>
      {renderIcon(iconName, '', size)}
      {label && <span>{label}</span>}
    </div>
  );
};

export default IconBadge;
