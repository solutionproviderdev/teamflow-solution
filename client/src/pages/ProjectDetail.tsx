import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateProject, deleteProject } from '@/store/slices/projectsSlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import KanbanBoard from '@/components/KanbanBoard';
import CommentSection from '@/components/CommentSection';
import ProjectGanttChart from '@/components/ProjectGanttChart';
import TaskList from '@/components/TaskList';
import { renderIcon } from '@/utils/iconUtils';
import ProjectOverviewTab from '@/components/ProjectOverviewTab';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const project = useAppSelector(state => 
    state.projects.find(p => p.id === projectId)
  );
  
  const tasks = useAppSelector(state => 
    state.tasks.filter(task => task.projectId === projectId)
  );
  
  const users = useAppSelector(state => state.users);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!project) {
      toast({
        title: 'Project not found',
        description: 'The project you are looking for does not exist.',
        variant: 'destructive',
      });
      navigate('/projects');
    }
  }, [project, navigate]);
  
  if (!project) {
    return null;
  }
  
  const handleDelete = () => {
    dispatch(deleteProject(project.id));
    toast({
      title: 'Project deleted',
      description: 'The project has been successfully deleted.',
    });
    navigate('/projects');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'on_hold':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'on_hold':
        return 'On Hold';
      default:
        return 'Unknown';
    }
  };
  
  const projectManager = users.find(user => user.id === project.managerId);
  
  return (
		<div className="container mx-auto p-4 lg:p-6 animate-fade-in">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
				<div className="flex items-center gap-3 mb-4 md:mb-0">
					<div className="bg-primary/10 p-3 rounded-lg">
						{renderIcon(project.iconName, 'text-primary h-6 w-6')}
					</div>
					<div>
						<h1 className="text-3xl font-bold">{project.title}</h1>
						<div className="flex items-center gap-2 mt-1">
							<Badge className={getStatusColor(project.status)}>
								{getStatusText(project.status)}
							</Badge>
							{project.deadline && (
								<div className="flex items-center text-sm text-muted-foreground">
									<Calendar className="h-3.5 w-3.5 mr-1" />
									Due {format(new Date(project.deadline), 'MMM d, yyyy')}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(`/projects/${project.id}/edit`)}
					>
						<Edit className="h-4 w-4 mr-1" />
						Edit
					</Button>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="sm">
								<Trash2 className="h-4 w-4 mr-1" />
								Delete
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This will permanently delete the project "{project.title}" and
									all associated tasks. This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<Button
						size="sm"
						onClick={() => navigate(`/tasks/new?projectId=${project.id}`)}
					>
						<Plus className="h-4 w-4 mr-1" />
						Add Task
					</Button>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
					<TabsTrigger value="comments">
						Comments ({project.comments.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<ProjectOverviewTab project={project} tasks={tasks} users={users} />
				</TabsContent>

				<TabsContent value="tasks">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Project Tasks</CardTitle>
								<CardDescription>Manage tasks for this project</CardDescription>
							</div>
							<Button
								size="sm"
								onClick={() => navigate(`/tasks/new?projectId=${project.id}`)}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Task
							</Button>
						</CardHeader>
						<CardContent>
							<TaskList
								tasks={tasks}
								showProject={false}
								emptyMessage="No tasks have been created for this project yet."
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="comments">
					<Card>
						<CardHeader>
							<CardTitle>Comments</CardTitle>
						</CardHeader>
						<CardContent>
							<CommentSection
								entityId={project.id}
								entityType="project"
								comments={project.comments}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ProjectDetail;
