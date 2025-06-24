
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { calculateProjectProgress, formatDate } from '@/utils/dataUtils';
import { renderIcon } from '@/utils/iconUtils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import IconBadge from './IconBadge';
import { Clock, Users } from 'lucide-react';

interface ProjectCardProps {
  projectId: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectId }) => {
  const project = useAppSelector(state => 
    state.projects.find(p => p.id === projectId)
  );
  
  const users = useAppSelector(state => state.users);
  const tasks = useAppSelector(state => state.tasks);
  
  if (!project) return null;
  
  const progress = calculateProjectProgress(project.id, tasks);
  const manager = users.find(user => user.id === project.managerId);
  const taskCount = tasks.filter(task => task.projectId === project.id).length;
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBadge iconName={project.iconName} size={18} />
          <Link to={`/projects/${project.id}`} className="text-lg font-medium hover:text-primary transition-colors">
            {project.title}
          </Link>
        </div>
        <Badge className={getStatusClass(project.status)}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {project.description}
        </p>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 text-sm flex flex-wrap justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Users size={14} />
          <span>{project.members.length} members</span>
        </div>
        
        {project.deadline && (
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>Due {formatDate(project.deadline)}</span>
          </div>
        )}
        
        <div className="w-full text-xs text-muted-foreground mt-2 flex items-center justify-between">
          <span>{taskCount} tasks</span>
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
