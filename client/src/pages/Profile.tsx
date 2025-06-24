import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/usersSlice';
import { renderIcon, userIcons, IconName, IconSelect } from '@/utils/iconUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { icons } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const user = useAppSelector(state => state.users.find(u => u.id === currentUserId));
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [iconName, setIconName] = useState<IconName>(user?.iconName as IconName || 'User');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    dispatch(updateUser({
      id: user.id,
      name,
      email,
      jobTitle,
      iconName
    }));
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.'
      });
    }, 500);
  };
  
  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-3xl animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    {renderIcon(iconName, 'text-primary', 40)}
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" type="button">Change Icon</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-4 border-b">
                        <h4 className="font-medium">Select an Icon</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose an icon to represent you
                        </p>
                      </div>
                      <IconSelect
                        iconList={userIcons}
                        selectedIcon={iconName}
                        onSelect={setIconName}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={user.role}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Role cannot be changed. Contact an administrator for role changes.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="ml-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="ml-2">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Profile;
