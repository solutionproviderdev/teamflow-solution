
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/ProjectCard';
import { PlusCircle, Search } from 'lucide-react';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const projects = useAppSelector(state => state.projects);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const [filter, setFilter] = useState<'all' | 'managed' | 'member'>('all');
  const [search, setSearch] = useState('');
  
  const filteredProjects = projects
    .filter(project => {
      if (filter === 'managed') return project.managerId === currentUserId;
      if (filter === 'member') return project.members.includes(currentUserId);
      return true;
    })
    .filter(project => 
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
    );
  
  return (
    <div className="container mx-auto p-4 lg:p-6 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track your projects</p>
        </div>
        
        <Button onClick={() => navigate('/projects/new')} className="md:self-end">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </header>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={filter} 
          onValueChange={(value) => setFilter(value as any)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="managed">Managed by Me</SelectItem>
            <SelectItem value="member">Member Of</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} projectId={project.id} />
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <CardTitle className="mb-2">No projects found</CardTitle>
            <CardDescription className="mb-4">
              {search 
                ? "No projects match your search criteria" 
                : "You don't have any projects yet"}
            </CardDescription>
            <Button onClick={() => navigate('/projects/new')}>Create Project</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectList;
