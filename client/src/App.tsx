
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectNew from './pages/ProjectNew';
import ProjectDetail from './pages/ProjectDetail';
import TaskList from './pages/TaskList';
import TaskNew from './pages/TaskNew';
import TaskDetail from './pages/TaskDetail';
import TeamList from './pages/TeamList';
import TeamNew from './pages/TeamNew';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectNew />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/new" element={<TaskNew />} />
            <Route path="tasks/:taskId" element={<TaskDetail />} />
            <Route path="team" element={<TeamList />} />
            <Route path="team/new" element={<TeamNew />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
