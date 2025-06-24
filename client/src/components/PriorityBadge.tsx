
import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/store/types';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { getPriorityColor } from '@/utils/dataUtils';

interface PriorityBadgeProps {
  priority: Task['priority'];
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const priorityIcons = {
    low: <ArrowDown className="h-3.5 w-3.5" />,
    medium: <ArrowRight className="h-3.5 w-3.5" />,
    high: <ArrowUp className="h-3.5 w-3.5" />
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      getPriorityColor(priority),
      className
    )}>
      {priorityIcons[priority]}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export default PriorityBadge;
