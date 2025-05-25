'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { holidays } from '@/lib/data';

interface HolidayFormProps {
  onClose: () => void;
  country: string;
}

export function HolidayForm({ onClose, country }: HolidayFormProps) {
  const { toast } = useToast();
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!holidayName.trim() || !holidayDate) {
        toast({
          title: "Missing information",
          description: "Please provide both a name and date for the holiday",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new holiday
      const newHoliday = {
        id: (holidays.length + 1).toString(),
        name: holidayName,
        date: holidayDate.toISOString(),
        country,
      };
      
      holidays.push(newHoliday as any);
      
      toast({
        title: "Holiday added",
        description: "The holiday has been added to the calendar",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to add holiday",
        description: "An error occurred while adding the holiday",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="holidayName">Holiday Name</Label>
        <Input 
          id="holidayName" 
          placeholder="e.g., Independence Day"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="holidayDate">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !holidayDate && "text-muted-foreground"
              )}
              id="holidayDate"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {holidayDate ? format(holidayDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={holidayDate}
              onSelect={setHolidayDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Holiday"}
        </Button>
      </div>
    </form>
  );
}