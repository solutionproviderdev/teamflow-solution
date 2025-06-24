
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { renderIcon } from '@/utils/iconUtils';
import { formatDate, getUserTasks } from '@/utils/dataUtils';
import { PlusCircle, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from '@/components/StatusBadge';

const TeamList: React.FC = () => {
  const navigate = useNavigate();
  const users = useAppSelector(state => state.users);
  const currentUser = useAppSelector(state => {
    const currentUserId = state.auth.currentUserId;
    return state.users.find(user => user.id === currentUserId);
  });
  const tasks = useAppSelector(state => state.tasks);
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'worker'>('all');
  
  if (currentUser?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }
  
  const filteredUsers = users
    .filter(user => {
      if (roleFilter === 'all') return true;
      return user.role === roleFilter;
    })
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.jobTitle.toLowerCase().includes(search.toLowerCase())
    );
  
  return (
    <div className="container mx-auto p-4 lg:p-6 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage your team</p>
        </div>
        
        <Button onClick={() => navigate('/team/new')} className="md:self-end">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </header>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={roleFilter} 
          onValueChange={(value) => setRoleFilter(value as any)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="worker">Worker</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredUsers.length > 0 ? (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Tasks</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => {
                    const userTasks = getUserTasks(user.id, tasks);
                    const activeTasks = userTasks.filter(task => task.status === 'in_progress');
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1 rounded-full">
                              {renderIcon(user.iconName, 'text-primary', 18)}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.jobTitle}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{activeTasks.length}</span>
                            <span className="text-xs text-muted-foreground">active</span>
                            <span className="text-xs text-muted-foreground mx-1">/</span>
                            <span className="font-medium">{userTasks.length}</span>
                            <span className="text-xs text-muted-foreground">total</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/team/${user.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <CardTitle className="mb-2">No team members found</CardTitle>
            <CardDescription className="mb-4">
              {search || roleFilter !== 'all'
                ? "No team members match your search criteria"
                : "You don't have any team members yet"}
            </CardDescription>
            <Button onClick={() => navigate('/team/new')}>Add Team Member</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamList;
