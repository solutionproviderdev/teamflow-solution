
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addProjectComment } from '@/store/slices/projectsSlice';
import { addTaskComment } from '@/store/slices/tasksSlice';
import { Comment } from '@/store/types';
import { createComment, formatDate } from '@/utils/dataUtils';
import { renderIcon } from '@/utils/iconUtils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  entityId: string;
  entityType: 'project' | 'task';
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  entityId, 
  entityType 
}) => {
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState('');
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const users = useAppSelector(state => state.users);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    
    const comment = createComment(newComment.trim(), currentUserId);
    
    if (entityType === 'project') {
      dispatch(addProjectComment({ projectId: entityId, comment }));
    } else {
      dispatch(addTaskComment({ taskId: entityId, comment }));
    }
    
    setNewComment('');
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px] flex-1"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((comment) => {
              const author = users.find(user => user.id === comment.authorId);
              return (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg glass-card animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {author && renderIcon(author.iconName, 'text-primary', 16)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{author?.name || 'Unknown User'}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
