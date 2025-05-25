'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CalendarPlus, Cog, Info, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { systemSettings, holidays } from '@/lib/data';
import { HolidayForm } from '@/components/settings/holiday-form';
import { format, parseISO } from 'date-fns';

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isHolidayFormOpen, setIsHolidayFormOpen] = useState(false);
  
  const [country, setCountry] = useState(systemSettings.country);
  const [defaultQuota, setDefaultQuota] = useState(systemSettings.defaultAnnualLeaveQuota);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect non-admin users
  if (!isAdmin) {
    router.push('/dashboard');
    return null;
  }
  
  // Filter holidays by selected country
  const countryHolidays = holidays.filter(holiday => holiday.country === country);
  
  // Sort holidays by date
  const sortedHolidays = [...countryHolidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    try {
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update settings
      systemSettings.country = country;
      systemSettings.defaultAnnualLeaveQuota = defaultQuota;
      
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "An error occurred while saving the settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteHoliday = async (holidayId: string) => {
    try {
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find and remove the holiday
      const holidayIndex = holidays.findIndex(h => h.id === holidayId);
      if (holidayIndex !== -1) {
        holidays.splice(holidayIndex, 1);
      }
      
      toast({
        title: "Holiday deleted",
        description: "The holiday has been removed from the calendar",
      });
    } catch (error) {
      toast({
        title: "Failed to delete holiday",
        description: "An error occurred while deleting the holiday",
        variant: "destructive",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">
              Configure global settings for leave management
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure company-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Company Country</Label>
                  <Select 
                    value={country}
                    onValueChange={setCountry}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This affects which public holidays are displayed in the calendar
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultQuota">Default Annual Leave Quota (Days)</Label>
                  <Input 
                    id="defaultQuota" 
                    type="number" 
                    min="0"
                    value={defaultQuota}
                    onChange={(e) => setDefaultQuota(parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Default number of annual leave days for new employees
                  </p>
                </div>
                
                <div className="flex items-center p-3 text-sm bg-amber-50 dark:bg-amber-950/50 rounded-md border border-amber-200 dark:border-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                  <span className="text-amber-800 dark:text-amber-300">
                    Changing these settings will not affect existing users
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Save size={16} />
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">LeaveTrack</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-1">Support</h3>
                  <p className="text-sm text-muted-foreground">
                    For support inquiries, please contact<br />
                    support@leavetrack.example.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5" />
                  Public Holidays
                </CardTitle>
                
                <Dialog open={isHolidayFormOpen} onOpenChange={setIsHolidayFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      Add Holiday
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Public Holiday</DialogTitle>
                      <DialogDescription>
                        Add a new public holiday to the calendar
                      </DialogDescription>
                    </DialogHeader>
                    <HolidayForm 
                      onClose={() => setIsHolidayFormOpen(false)} 
                      country={country}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Public holidays for {
                  {
                    'US': 'United States',
                    'UK': 'United Kingdom',
                    'CA': 'Canada',
                    'AU': 'Australia',
                    'DE': 'Germany',
                    'FR': 'France',
                    'JP': 'Japan',
                    'IN': 'India',
                  }[country] || country
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {sortedHolidays.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <CalendarPlus className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No holidays defined for this country</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsHolidayFormOpen(true)}
                    >
                      Add your first holiday
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedHolidays.map((holiday) => (
                      <div key={holiday.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0">
                        <div>
                          <h3 className="font-medium">{holiday.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(holiday.date), 'MMMM d, yyyy')}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {holiday.country}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}