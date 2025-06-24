
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const currentUser = useAppSelector(state => {
    const userId = state.auth.currentUserId;
    return state.users.find(user => user.id === userId);
  });
  
  const isAdmin = currentUser?.role === 'admin';
  
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
  ];
  
  if (isAdmin) {
    navItems.push({ label: 'Team Members', path: '/team', icon: Users });
  }
  
  navItems.push({ label: 'Settings', path: '/settings', icon: Settings });
  
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "lg:translate-x-0 lg:static"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-bold">Solution Manager</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "nav-item flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                end
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {currentUser && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="bg-sidebar-accent rounded-full p-2">
                <Users className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{currentUser.jobTitle}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
