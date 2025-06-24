
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KanbanBoard from '@/components/KanbanBoard';
import { PlusCircle, Search } from 'lucide-react';
import { Task } from '@/store/types';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const tasks = useAppSelector(state => state.tasks);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const projects = useAppSelector(state => state.projects);
  
  const [filter, setFilter] = useState<'all' | 'assigned' | 'created'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  const userProjects = projects.filter(project => 
    project.managerId === currentUserId || 
    project.members.includes(currentUserId)
  );
  
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'assigned') return task.assigneeId === currentUserId;
      return true;
    })
    .filter(task => {
      if (projectFilter === 'all') return true;
      return task.projectId === projectFilter;
    })
    .filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    );
  
  return (
    <div className="container mx-auto p-4 lg:p-6 animate-fade-in">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task Board</h1>
          <p className="text-muted-foreground mt-1">Manage and track your tasks</p>
        </div>
        
        <Button onClick={() => navigate('/tasks/new')} className="md:self-end">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </header>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={filter} 
          onValueChange={(value) => setFilter(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="assigned">Assigned to Me</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={projectFilter} 
          onValueChange={setProjectFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {userProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <KanbanBoard tasks={filteredTasks} />
    </div>
  );
};

export default TaskList;
