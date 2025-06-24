
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  startTask, 
  completeTask, 
  holdTask, 
  blockTask, 
  reopenTask 
} from '@/store/slices/tasksSlice';
import { Task } from '@/store/types';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  CheckCircle, 
  PauseCircle, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TaskStatusActionsProps {
  task: Task;
  compact?: boolean;
}

const TaskStatusActions: React.FC<TaskStatusActionsProps> = ({ task, compact = false }) => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  
  // Safely check if task exists before accessing its properties
  if (!task) {
    return null;
  }
  
  const isAssignee = task.assigneeId === currentUserId;
  
  const handleAction = (action: 'start' | 'complete' | 'hold' | 'block' | 'reopen') => {
    if (!isAssignee) {
      toast({
        title: 'Not allowed',
        description: 'You can only update tasks assigned to you.',
        variant: 'destructive'
      });
      return;
    }
    
    switch (action) {
      case 'start':
        dispatch(startTask(task.id));
        toast({ description: 'Task started.' });
        break;
      case 'complete':
        dispatch(completeTask(task.id));
        toast({ description: 'Task completed. Great job!' });
        break;
      case 'hold':
        dispatch(holdTask(task.id));
        toast({ description: 'Task put on hold.' });
        break;
      case 'block':
        dispatch(blockTask(task.id));
        toast({ description: 'Task marked as blocked.' });
        break;
      case 'reopen':
        dispatch(reopenTask(task.id));
        toast({ description: 'Task reopened.' });
        break;
    }
  };
  
  const getAvailableActions = () => {
    switch (task.status) {
      case 'todo':
        return [
          { action: 'start', label: 'Start', icon: Play, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      case 'in_progress':
        return [
          { action: 'complete', label: 'Complete', icon: CheckCircle, color: 'bg-green-500 hover:bg-green-600' },
          { action: 'hold', label: 'Hold', icon: PauseCircle, color: 'bg-yellow-500 hover:bg-yellow-600' },
          { action: 'block', label: 'Block', icon: XCircle, color: 'bg-red-500 hover:bg-red-600' }
        ];
      case 'on_hold':
        return [
          { action: 'start', label: 'Resume', icon: Play, color: 'bg-blue-500 hover:bg-blue-600' },
          { action: 'block', label: 'Block', icon: XCircle, color: 'bg-red-500 hover:bg-red-600' }
        ];
      case 'blocked':
        return [
          { action: 'reopen', label: 'Reopen', icon: RefreshCw, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      case 'completed':
        return [
          { action: 'reopen', label: 'Reopen', icon: RefreshCw, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      default:
        return [];
    }
  };
  
  const actions = getAvailableActions();
  
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {actions.map(({ action, icon: Icon, color }) => (
          <Button
            key={action}
            size="sm"
            variant="outline"
            className={`p-1 h-8 w-8 rounded-full ${isAssignee ? color : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => handleAction(action as any)}
            disabled={!isAssignee}
            title={`${action.charAt(0).toUpperCase() + action.slice(1)} Task`}
          >
            <Icon className="h-4 w-4 text-white" />
          </Button>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(({ action, label, icon: Icon, color }) => (
        <Button
          key={action}
          size="sm"
          className={`${isAssignee ? color : 'opacity-50 cursor-not-allowed'} text-white`}
          onClick={() => handleAction(action as any)}
          disabled={!isAssignee}
        >
          <Icon className="mr-1 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default TaskStatusActions;
