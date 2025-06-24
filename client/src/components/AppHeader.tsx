
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { renderIcon } from '@/utils/iconUtils';
import { downloadJson } from '@/utils/dataUtils';
import { 
  LogOut, 
  Download, 
  Upload, 
  Settings, 
  MenuIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

interface AppHeaderProps {
  toggleSidebar: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const users = useAppSelector(state => state.users);
  const currentUser = users.find(user => user.id === currentUserId);
  const appState = useAppSelector(state => state);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.'
    });
  };
  
  const handleExport = () => {
    downloadJson(appState, 'solution-manager-data.json');
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        // Since we can't directly modify the Redux store here,
        // we'll store the JSON in local storage and reload the page
        localStorage.setItem('solutionManagerState', jsonData);
        toast({
          title: 'Import Successful',
          description: 'The application will now reload with the imported data.'
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: 'Import Failed',
          description: 'The file format is invalid.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <h1 className="text-xl font-bold text-primary">
              Solution Manager
            </h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isAuthenticated && currentUser && (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="flex items-center justify-center h-full w-full bg-primary/10 rounded-full">
                    {renderIcon(currentUser.iconName, 'text-primary', 20)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export Data</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Import Data</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
