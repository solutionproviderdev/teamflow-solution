
import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils/dataUtils';
import { Task } from '@/store/types';

interface StatusBadgeProps {
  status: Task['status'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusLabels: Record<Task['status'], string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    blocked: 'Blocked',
    completed: 'Completed'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      getStatusColor(status),
      className
    )}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
