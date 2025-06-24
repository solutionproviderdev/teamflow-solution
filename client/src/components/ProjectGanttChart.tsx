
import React from 'react';
import { Task } from '@/store/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, parseISO } from 'date-fns';
import PriorityBadge from './PriorityBadge';

interface ProjectGanttChartProps {
  tasks: Task[];
}

const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({ tasks }) => {
  const tasksWithDeadlines = tasks.filter(task => task.deadline);
  
  if (tasksWithDeadlines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No tasks with deadlines to display timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate project date range
  const allDates = tasksWithDeadlines
    .map(task => parseISO(task.deadline!))
    .concat(tasksWithDeadlines.map(task => parseISO(task.createdAt)));
  
  const projectStart = new Date(Math.min(...allDates.map(d => d.getTime())));
  const projectEnd = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalProjectDays = differenceInDays(projectEnd, projectStart) || 1;

  const getTaskProgress = (task: Task) => {
    switch (task.status) {
      case 'completed': return 100;
      case 'in_progress': return 50;
      case 'on_hold': return 25;
      case 'blocked': return 10;
      default: return 0;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      case 'on_hold': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Start: {format(projectStart, 'MMM d, yyyy')}</span>
          <span>End: {format(projectEnd, 'MMM d, yyyy')}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasksWithDeadlines.map(task => {
          const taskStart = parseISO(task.createdAt);
          const taskEnd = parseISO(task.deadline!);
          const daysFromStart = differenceInDays(taskStart, projectStart);
          const taskDuration = differenceInDays(taskEnd, taskStart) || 1;
          
          const leftOffset = (daysFromStart / totalProjectDays) * 100;
          const width = (taskDuration / totalProjectDays) * 100;
          
          return (
            <div key={task.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} />
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(task.status)} text-white border-0`}
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(taskEnd, 'MMM d')}
                </span>
              </div>
              
              <div className="relative h-6 bg-muted rounded">
                <div 
                  className="absolute h-full bg-primary/20 rounded"
                  style={{
                    left: `${Math.max(0, leftOffset)}%`,
                    width: `${Math.min(width, 100 - Math.max(0, leftOffset))}%`
                  }}
                />
                <div 
                  className="absolute h-full bg-primary rounded"
                  style={{
                    left: `${Math.max(0, leftOffset)}%`,
                    width: `${(Math.min(width, 100 - Math.max(0, leftOffset)) * getTaskProgress(task)) / 100}%`
                  }}
                />
              </div>
              
              <Progress 
                value={getTaskProgress(task)} 
                className="h-1"
              />
            </div>
          );
        })}
        
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-xl font-bold">{tasks.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-xl font-bold">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectGanttChart;
