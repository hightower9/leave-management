'use client';

import { useState } from 'react';
import { format, addDays, isBefore } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { LeaveType, HalfDayType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { leaves } from '@/lib/data';

interface LeaveFormProps {
  onClose: () => void;
  userId: string;
  remainingLeave: number;
}

export function LeaveForm({ onClose, userId, remainingLeave }: LeaveFormProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 1));
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [isHalfDay, setIsHalfDay] = useState<boolean>(false);
  const [halfDayType, setHalfDayType] = useState<HalfDayType>('morning');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate dates
      if (isBefore(endDate, startDate)) {
        toast({
          title: "Invalid date range",
          description: "End date cannot be before start date",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new leave request
      const newLeave = {
        id: (leaves.length + 1).toString(),
        userId,
        type: leaveType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        halfDay: isHalfDay ? halfDayType : null,
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, this would send the data to the server
      // For our mock app, we'll just add it to the leaves array
      leaves.push(newLeave as any);
      
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit leave request",
        description: "An error occurred while submitting your leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setStartDate(date);
                    if (isBefore(endDate, date)) {
                      setEndDate(date);
                    }
                  }
                }}
                disabled={(date) => isBefore(date, new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                disabled={(date) => isBefore(date, startDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Leave Type</Label>
        <RadioGroup defaultValue="annual" className="flex gap-4" onValueChange={(value) => setLeaveType(value as LeaveType)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual">Annual Leave</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="normal" id="normal" />
            <Label htmlFor="normal">Normal Leave</Label>
          </div>
        </RadioGroup>
        {leaveType === 'annual' && (
          <p className="text-xs text-muted-foreground">
            You have {remainingLeave} days of annual leave remaining
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="halfDay" 
            className="rounded-sm"
            checked={isHalfDay}
            onChange={(e) => setIsHalfDay(e.target.checked)}
          />
          <Label htmlFor="halfDay">Half Day</Label>
        </div>
        
        {isHalfDay && (
          <Select 
            defaultValue="morning" 
            onValueChange={(value) => setHalfDayType(value as HalfDayType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select half day type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Leave</Label>
        <Textarea 
          id="reason" 
          placeholder="Provide a reason for your leave request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}