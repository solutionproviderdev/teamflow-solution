
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { calculateProjectProgress } from '@/utils/dataUtils';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, PlayIcon, PauseCircle, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const users = useAppSelector(state => state.users);
  const projects = useAppSelector(state => state.projects);
  const tasks = useAppSelector(state => state.tasks);
  
  const currentUser = users.find(user => user.id === currentUserId);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) return null;
  
  // Get user's projects (either as manager or member)
  const userProjects = projects.filter(project => 
    project.managerId === currentUserId || 
    project.members.includes(currentUserId)
  );
  
  // Get user's tasks
  const userTasks = tasks.filter(task => task.assigneeId === currentUserId);
  
  // Tasks by status
  const todoTasks = userTasks.filter(task => task.status === 'todo');
  const inProgressTasks = userTasks.filter(task => task.status === 'in_progress');
  const onHoldTasks = userTasks.filter(task => task.status === 'on_hold');
  const blockedTasks = userTasks.filter(task => task.status === 'blocked');
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  
  // Tasks with upcoming deadlines
  const upcomingDeadlines = userTasks
    .filter(task => task.status !== 'completed' && task.deadline)
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);
  
  // Calculate total progress across all projects
  const totalProjectsProgress = userProjects.length > 0
    ? userProjects.reduce((sum, project) => sum + calculateProjectProgress(project.id, tasks), 0) / userProjects.length
    : 0;
  
  // Calculate task completion rate
  const completionRate = userTasks.length > 0
    ? Math.round((completedTasks.length / userTasks.length) * 100)
    : 0;
  
  return (
    <div className="container mx-auto p-4 lg:p-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
        <p className="text-muted-foreground mt-1">Your task management dashboard</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PlayIcon className="text-blue-500" size={18} />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-3xl font-bold">{inProgressTasks.length}</p>
            <p className="text-sm text-muted-foreground">tasks currently active</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PauseCircle className="text-yellow-500" size={18} />
              On Hold
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-3xl font-bold">{onHoldTasks.length}</p>
            <p className="text-sm text-muted-foreground">tasks paused</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="text-red-500" size={18} />
              Blocked
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-3xl font-bold">{blockedTasks.length}</p>
            <p className="text-sm text-muted-foreground">tasks facing issues</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="text-green-500" size={18} />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-3xl font-bold">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">task completion rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Button onClick={() => navigate('/projects')}>View All</Button>
          </div>
          
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.slice(0, 4).map(project => (
                <ProjectCard key={project.id} projectId={project.id} />
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">You don't have any projects yet.</p>
                <Button onClick={() => navigate('/projects/new')}>Create Project</Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Upcoming Deadlines</h2>
          
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {upcomingDeadlines.map(task => (
                <Card key={task.id} className="glass-card">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock size={14} className="text-primary" />
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <div className="text-xs flex justify-between">
                      <span className="text-muted-foreground">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No upcoming deadlines.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Tasks</h2>
          <Button onClick={() => navigate('/tasks')}>View All</Button>
        </div>
        
        <Tabs defaultValue="in_progress">
          <TabsList className="mb-4">
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="in_progress">
            {inProgressTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} taskId={task.id} />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any tasks in progress.</p>
                  <Button onClick={() => navigate('/tasks')}>View All Tasks</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="todo">
            {todoTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todoTasks.map(task => (
                  <TaskCard key={task.id} taskId={task.id} />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You don't have any todo tasks.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="on_hold">
            {onHoldTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onHoldTasks.map(task => (
                  <TaskCard key={task.id} taskId={task.id} />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You don't have any tasks on hold.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="blocked">
            {blockedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blockedTasks.map(task => (
                  <TaskCard key={task.id} taskId={task.id} />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You don't have any blocked tasks.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
