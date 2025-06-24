
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addTask } from '@/store/slices/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Check } from 'lucide-react';
import { Task } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';

interface InlineTaskFormProps {
  projectId: string;
  status: Task['status'];
  onCancel: () => void;
  onSuccess: () => void;
}

const InlineTaskForm: React.FC<InlineTaskFormProps> = ({ 
  projectId, 
  status, 
  onCancel, 
  onSuccess 
}) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [deadline, setDeadline] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      projectId,
      assigneeId: assigneeId || null,
      status,
      priority,
      deadline: deadline || null,
      iconName: 'square-check',
      comments: [],
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null
    };
    
    dispatch(addTask(newTask));
    onSuccess();
  };
  
  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
            autoFocus
          />
          
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm min-h-[60px] resize-none"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priority} onValueChange={(value) => setPriority(value as Task['priority'])}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            type="date"
            placeholder="Deadline (optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="text-sm"
          />
          
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm"
              disabled={!title.trim()}
            >
              <Check className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InlineTaskForm;
