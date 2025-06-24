
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/store/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { renderIcon } from '@/utils/iconUtils';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DeadlineBadge from './DeadlineBadge';

interface TaskListProps {
  tasks: Task[];
  showProject?: boolean;
  emptyMessage?: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  showProject = true,
  emptyMessage = "No tasks found." 
}) => {
  const navigate = useNavigate();
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} className="hover:bg-accent/5 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-md">
                {renderIcon(task.iconName, 'h-5 w-5 text-primary')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-medium text-lg line-clamp-1">{task.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">{task.description}</p>
                
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  {task.assigneeId && (
                    <div className="bg-secondary/50 px-2 py-1 rounded-md">
                      Assigned
                    </div>
                  )}
                  
                  {task.deadline && (
                    <DeadlineBadge deadline={task.deadline} />
                  )}
                  
                  <div className="text-muted-foreground">
                    Created {format(new Date(task.createdAt), 'MMM d')}
                  </div>
                  
                  <div className="flex-1"></div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
