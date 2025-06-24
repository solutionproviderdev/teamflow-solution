
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { formatDate } from '@/utils/dataUtils';
import { renderIcon } from '@/utils/iconUtils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DeadlineBadge from './DeadlineBadge';
import TaskStatusActions from './TaskStatusActions';
import IconBadge from './IconBadge';
import { MessageSquare } from 'lucide-react';

interface TaskCardProps {
  taskId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ taskId }) => {
  const task = useAppSelector(state => 
    state.tasks.find(t => t.id === taskId)
  );
  
  const users = useAppSelector(state => state.users);
  const projects = useAppSelector(state => state.projects);
  
  if (!task) return null;
  
  const assignee = users.find(user => user.id === task.assigneeId);
  const project = projects.find(project => project.id === task.projectId);
  
  return (
    <Card className="glass-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBadge iconName={task.iconName} size={18} />
          <Link to={`/tasks/${task.id}`} className="text-lg font-medium hover:text-primary transition-colors">
            {task.title}
          </Link>
        </div>
        <StatusBadge status={task.status} />
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {task.description}
        </p>
        
        <div className="mt-3 flex items-center space-x-2">
          <PriorityBadge priority={task.priority} />
          {task.deadline && <DeadlineBadge deadline={task.deadline} />}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 text-sm flex flex-wrap justify-between gap-2">
        <div className="flex-1">
          {project && (
            <Link to={`/projects/${project.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {renderIcon(project.iconName, '', 14)}
              <span>{project.title}</span>
            </Link>
          )}
          
          {assignee ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span>Assigned to:</span>
              <span className="font-medium flex items-center gap-1">
                {renderIcon(assignee.iconName, '', 14)}
                {assignee.name}
              </span>
            </div>
          ) : (
            <div className="mt-1 text-xs text-muted-foreground">Unassigned</div>
          )}
          
          {task.comments.length > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare size={14} />
              <span>{task.comments.length} comments</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <TaskStatusActions task={task} compact />
          <div className="text-xs text-muted-foreground">
            Created {formatDate(task.createdAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
