
import React from 'react';
import { cn } from '@/lib/utils';
import { daysRemaining, formatDate } from '@/utils/dataUtils';
import { Clock } from 'lucide-react';

interface DeadlineBadgeProps {
  deadline: string | null;
  className?: string;
}

const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline, className }) => {
  if (!deadline) return null;
  
  const days = daysRemaining(deadline);
  
  let colorClass = 'bg-gray-100 text-gray-800';
  if (days !== null) {
    if (days < 0) {
      colorClass = 'bg-red-100 text-red-800';
    } else if (days <= 3) {
      colorClass = 'bg-yellow-100 text-yellow-800';
    } else {
      colorClass = 'bg-green-100 text-green-800';
    }
  }
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClass,
      className
    )}>
      <Clock className="h-3.5 w-3.5" />
      {days !== null
        ? days < 0
          ? `Overdue by ${Math.abs(days)} days`
          : days === 0
            ? 'Due today'
            : `${days} days left`
        : formatDate(deadline)
      }
    </span>
  );
};

export default DeadlineBadge;
