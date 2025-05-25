'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/dashboard/calendar';
import { LeaveChart } from '@/components/dashboard/leave-chart';
import { LeaveTable } from '@/components/dashboard/leave-table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { calculateLeaveSummary, getLeavesByUserId } from '@/lib/data';

export default function DashboardPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'stats' | 'calendar'>('stats');
  
  if (!user) {
    return null;
  }
  
  const leaveSummary = calculateLeaveSummary(user.id);
  const leaveData = getLeavesByUserId(user.id);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.firstName}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">
              Annual Leave: {leaveSummary.used}/{user.annualLeaveQuota} days used
            </Badge>
            <Badge variant="outline" className="text-sm bg-primary/10">
              {leaveSummary.remaining} days remaining
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="stats" className="space-y-4" onValueChange={(value) => setView(value as 'stats' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-md">Approved Leaves</CardTitle>
                  <CardDescription>Total approved requests</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{leaveSummary.approved}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-md">Pending Leaves</CardTitle>
                  <CardDescription>Awaiting approval</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{leaveSummary.pending}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-md">Leave Balance</CardTitle>
                  <CardDescription>Remaining annual leave</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{leaveSummary.remaining} days</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Leave Distribution</CardTitle>
                  <CardDescription>
                    Summary of your leave requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LeaveChart userId={user.id} />
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Leave Requests</CardTitle>
                  <CardDescription>
                    Your leave history and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LeaveTable userId={user.id} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Leave Calendar</CardTitle>
                <CardDescription>
                  View your approved leaves and team schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}