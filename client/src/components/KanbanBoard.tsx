
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/store/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { renderIcon } from '@/utils/iconUtils';
import { format } from 'date-fns';
import PriorityBadge from './PriorityBadge';
import DeadlineBadge from './DeadlineBadge';
import InlineTaskForm from './InlineTaskForm';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  projectId?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, projectId }) => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState<Task['status'] | null>(null);
  
  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
    { id: 'on_hold', title: 'On Hold', status: 'on_hold' as const },
    { id: 'blocked', title: 'Blocked', status: 'blocked' as const },
    { id: 'completed', title: 'Done', status: 'completed' as const },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'border-t-blue-500';
      case 'in_progress': return 'border-t-yellow-500';
      case 'on_hold': return 'border-t-orange-500';
      case 'blocked': return 'border-t-red-500';
      case 'completed': return 'border-t-green-500';
      default: return 'border-t-gray-500';
    }
  };

  const handleAddTask = (status: Task['status']) => {
    if (projectId) {
      setShowAddForm(status);
    } else {
      navigate('/tasks/new');
    }
  };

  const handleTaskCreated = () => {
    setShowAddForm(null);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddTask(column.status)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={`bg-muted/30 rounded-lg p-3 min-h-[600px] border-t-4 ${getColumnColor(column.status)}`}>
              <div className="space-y-3">
                {showAddForm === column.status && (
                  <InlineTaskForm
                    projectId={projectId!}
                    status={column.status}
                    onCancel={() => setShowAddForm(null)}
                    onSuccess={handleTaskCreated}
                  />
                )}
                
                {columnTasks.map(task => (
                  <Card 
                    key={task.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow bg-background"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-primary/10 p-1.5 rounded-md">
                          {renderIcon(task.iconName, 'h-4 w-4 text-primary')}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">
                            {task.title}
                          </h4>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <PriorityBadge priority={task.priority} />
                            
                            <div className="flex items-center gap-1">
                              {task.deadline && (
                                <DeadlineBadge deadline={task.deadline} />
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {format(new Date(task.createdAt), 'MMM d')}
                              </span>
                              {task.assigneeId && (
                                <span className="bg-secondary/70 px-1.5 py-0.5 rounded text-xs">
                                  Assigned
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnTasks.length === 0 && showAddForm !== column.status && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
