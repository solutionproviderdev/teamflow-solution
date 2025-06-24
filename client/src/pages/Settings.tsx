
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { downloadJson } from '@/utils/dataUtils';
import { useAppSelector } from '@/store/hooks';
import { toast } from '@/components/ui/use-toast';
import { Download, Upload, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const appState = useAppSelector(state => state);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      localStorage.removeItem('solutionManagerState');
      toast({
        title: 'Data Reset',
        description: 'All data has been reset. The application will now reload.'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  
  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-3xl animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application settings</p>
      </header>
      
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export, import, or reset your application data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
            
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Export Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export all your data as a JSON file
                  </p>
                </div>
                <Button onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Import Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Import data from a JSON file
                  </p>
                </div>
                <Button onClick={handleImportClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Reset All Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all data and start fresh
                  </p>
                </div>
                <Button variant="destructive" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your application experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="notifications">
                  Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for task updates
                </p>
              </div>
              <Switch
                id="notifications"
                defaultChecked={true}
                onCheckedChange={() => {
                  toast({
                    description: "Notification settings updated."
                  });
                }}
              />
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="emailUpdates">
                  Email Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily email summaries
                </p>
              </div>
              <Switch
                id="emailUpdates"
                defaultChecked={false}
                onCheckedChange={() => {
                  toast({
                    description: "Email settings updated."
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Application information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Application:</span>
                <span className="ml-2">Solution Manager</span>
              </div>
              <div>
                <span className="font-medium">Version:</span>
                <span className="ml-2">1.0.0</span>
              </div>
              <div>
                <span className="font-medium">Created with:</span>
                <span className="ml-2">React, Redux, Tailwind CSS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
