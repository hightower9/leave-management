'use client';

import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getLeavesByUserId, getProjectsByUserId, getUsersByProjectId, getHolidaysByCountry, systemSettings } from '@/lib/data';
import { parseISO, isSameDay, isWithinInterval, format, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Leave, User } from '@/lib/types';

interface CalendarProps {
  userId: string;
}

interface DayInfo {
  userLeaves: Leave[];
  teamLeaves: Array<{ leave: Leave; user: User }>;
  holidays: string[];
}

export function Calendar({ userId }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dayInfo, setDayInfo] = useState<DayInfo>({ userLeaves: [], teamLeaves: [], holidays: [] });
  
  // Get the user's leaves
  const userLeaves = getLeavesByUserId(userId);
  
  // Get team leaves from projects the user is part of
  const userProjects = getProjectsByUserId(userId);
  const projectMembers = userProjects.flatMap(project => 
    getUsersByProjectId(project.id).filter(user => user.id !== userId)
  );
  // Remove duplicates
  const uniqueTeamMembers = Array.from(new Map(projectMembers.map(member => [member.id, member])).values());
  
  // Get team leaves
  const teamLeaves = uniqueTeamMembers.flatMap(member => {
    const memberLeaves = getLeavesByUserId(member.id)
      .filter(leave => leave.status === 'approved'); // Only show approved leaves for team members
    return memberLeaves.map(leave => ({ leave, user: member }));
  });
  
  // Get holidays
  const holidays = getHolidaysByCountry(systemSettings.country);
  
  const dayHasUserLeave = (date: Date) => {
    return userLeaves.some(leave => {
      const startDate = parseISO(leave.startDate);
      const endDate = parseISO(leave.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };
  
  const dayHasTeamLeave = (date: Date) => {
    return teamLeaves.some(({ leave }) => {
      const startDate = parseISO(leave.startDate);
      const endDate = parseISO(leave.endDate);
      return leave.status === 'approved' && isWithinInterval(date, { start: startDate, end: endDate });
    });
  };
  
  const dayIsHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = parseISO(holiday.date);
      return isSameDay(date, holidayDate);
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Get info for the selected day
    const dayUserLeaves = userLeaves.filter(leave => {
      const startDate = parseISO(leave.startDate);
      const endDate = parseISO(leave.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
    
    const dayTeamLeaves = teamLeaves.filter(({ leave }) => {
      const startDate = parseISO(leave.startDate);
      const endDate = parseISO(leave.endDate);
      return leave.status === 'approved' && isWithinInterval(date, { start: startDate, end: endDate });
    });
    
    const dayHolidays = holidays
      .filter(holiday => isSameDay(date, parseISO(holiday.date)))
      .map(holiday => holiday.name);
    
    setDayInfo({
      userLeaves: dayUserLeaves,
      teamLeaves: dayTeamLeaves,
      holidays: dayHolidays,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-[350px] border border-border rounded-md p-4">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md"
          modifiersClassNames={{
            selected: 'bg-primary text-primary-foreground',
          }}
          modifiers={{
            userLeave: (date) => dayHasUserLeave(date),
            teamLeave: (date) => dayHasTeamLeave(date),
            holiday: (date) => dayIsHoliday(date),
          }}
          modifiersStyles={{
            userLeave: {
              backgroundColor: 'hsla(var(--chart-2) / 0.2)',
              fontWeight: 'bold',
            },
            teamLeave: {
              border: '2px solid hsla(var(--chart-4) / 0.5)',
            },
            holiday: {
              backgroundColor: 'hsla(var(--chart-1) / 0.2)',
            }
          }}
        />
        
        <div className="flex flex-wrap gap-2 justify-start mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
            <span className="text-xs">Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsla(var(--chart-2) / 0.2)' }}></div>
            <span className="text-xs">Your Leave</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm border-2" style={{ borderColor: 'hsla(var(--chart-4) / 0.5)' }}></div>
            <span className="text-xs">Team Leave</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsla(var(--chart-1) / 0.2)' }}></div>
            <span className="text-xs">Holiday</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium mb-2">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
        </h3>
        
        <ScrollArea className="h-[400px] pr-4">
          {dayInfo.holidays.length > 0 && (
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    Public Holiday
                  </Badge>
                </div>
                {dayInfo.holidays.map((holiday, index) => (
                  <div key={index} className="text-sm">
                    {holiday}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {dayInfo.userLeaves.length > 0 && (
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Your Leave
                  </Badge>
                </div>
                {dayInfo.userLeaves.map((leave) => (
                  <div key={leave.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`capitalize ${leave.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : leave.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                        {leave.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {leave.type}
                      </Badge>
                      {leave.halfDay && (
                        <Badge variant="outline">
                          {leave.halfDay}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{leave.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {dayInfo.teamLeaves.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Team Leaves
                  </Badge>
                </div>
                {dayInfo.teamLeaves.map(({ leave, user }, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {user.firstName} {user.lastName}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {leave.type}
                      </Badge>
                      {leave.halfDay && (
                        <Badge variant="outline">
                          {leave.halfDay}
                        </Badge>
                      )}
                    </div>
                    {leave.reason && (
                      <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {dayInfo.holidays.length === 0 && dayInfo.userLeaves.length === 0 && dayInfo.teamLeaves.length === 0 && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No events for this day
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}