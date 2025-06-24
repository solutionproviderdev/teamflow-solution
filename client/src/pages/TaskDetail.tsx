
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { renderIcon } from '@/utils/iconUtils';
import { formatDate } from '@/utils/dataUtils';
import { MoreVertical, Clock, UserCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import DeadlineBadge from '@/components/DeadlineBadge';
import TaskStatusActions from '@/components/TaskStatusActions';
import CommentSection from '@/components/CommentSection';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const task = useAppSelector(state => 
    state.tasks.find(t => t.id === taskId)
  );
  
  const allUsers = useAppSelector(state => state.users);
  const allProjects = useAppSelector(state => state.projects);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!task) {
    return (
      <div className="container mx-auto p-4 lg:p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Task not found</h1>
        <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }
  
  const project = allProjects.find(p => p.id === task.projectId);
  const assignee = allUsers.find(user => user.id === task.assigneeId);
  
  return (
    <div className="container mx-auto p-4 lg:p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            {renderIcon(task.iconName, 'text-primary', 24)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <StatusBadge status={task.status} />
              <span className="text-xs">•</span>
              <PriorityBadge priority={task.priority} />
              {project && (
                <>
                  <span className="text-xs">•</span>
                  <span className="text-sm text-muted-foreground">{project.title}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <TaskStatusActions task={task} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate(`/projects/${task.projectId}`)}
                disabled={!task.projectId}
              >
                View Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Assignee</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                {assignee ? (
                  <>
                    <div className="bg-primary/10 p-1 rounded-full">
                      {renderIcon(assignee.iconName, 'text-primary', 16)}
                    </div>
                    <span>{assignee.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <DeadlineBadge deadline={task.deadline} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(task.createdAt)}</span>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{task.description}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.startedAt && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Started</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(task.startedAt)}</span>
                </CardContent>
              </Card>
            )}
            
            {task.completedAt && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(task.completedAt)}</span>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments & Discussion</CardTitle>
              <CardDescription>
                Discuss task-related topics and share updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentSection 
                entityId={task.id}
                entityType="task"
                comments={task.comments}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetail;
