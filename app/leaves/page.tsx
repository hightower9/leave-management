'use client';

import { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { getLeavesByUserId, getUserById, calculateLeaveSummary } from '@/lib/data';
import { Leave } from '@/lib/types';
import { LeaveForm } from '@/components/leaves/leave-form';
import { LeaveDetail } from '@/components/leaves/leave-detail';

export default function LeavesPage() {
  const { user, isAdmin } = useAuth();
  const [activeLeave, setActiveLeave] = useState<Leave | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  if (!user) {
    return null;
  }
  
  const leaves = getLeavesByUserId(user.id);
  const leaveSummary = calculateLeaveSummary(user.id);
  
  // Filter leaves by status
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  const approvedLeaves = leaves.filter(leave => leave.status === 'approved');
  const rejectedLeaves = leaves.filter(leave => leave.status === 'rejected');
  
  const openLeaveDetail = (leave: Leave) => {
    setActiveLeave(leave);
    setIsDetailOpen(true);
  };
  
  const getLeaveStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  function formatLeaveDate(leave: Leave) {
    const startDate = format(parseISO(leave.startDate), 'MMM d, yyyy');
    const endDate = format(parseISO(leave.endDate), 'MMM d, yyyy');
    
    if (startDate === endDate) {
      if (leave.halfDay) {
        return `${startDate} (${leave.halfDay})`;
      }
      return startDate;
    }
    
    const days = differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1;
    return `${startDate} - ${endDate} (${days} days)`;
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground">
              Apply for and manage your leave requests
            </p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <CalendarIcon size={16} />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Fill in the details for your leave request
                </DialogDescription>
              </DialogHeader>
              <LeaveForm onClose={() => setIsFormOpen(false)} userId={user.id} remainingLeave={leaveSummary.remaining} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Annual Leave Balance</CardTitle>
              <CardDescription>Your current quota</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{leaveSummary.remaining}/{user.annualLeaveQuota} days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Used Days</CardTitle>
              <CardDescription>Annual leave days used</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{leaveSummary.used} days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Pending Requests</CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{leaveSummary.pending}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Leaves</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <LeaveList 
              leaves={leaves} 
              openLeaveDetail={openLeaveDetail} 
              getLeaveStatusIcon={getLeaveStatusIcon} 
              formatLeaveDate={formatLeaveDate}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <LeaveList 
              leaves={pendingLeaves} 
              openLeaveDetail={openLeaveDetail} 
              getLeaveStatusIcon={getLeaveStatusIcon} 
              formatLeaveDate={formatLeaveDate}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <LeaveList 
              leaves={approvedLeaves} 
              openLeaveDetail={openLeaveDetail} 
              getLeaveStatusIcon={getLeaveStatusIcon} 
              formatLeaveDate={formatLeaveDate}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <LeaveList 
              leaves={rejectedLeaves} 
              openLeaveDetail={openLeaveDetail} 
              getLeaveStatusIcon={getLeaveStatusIcon} 
              formatLeaveDate={formatLeaveDate}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {activeLeave && (
            <LeaveDetail 
              leave={activeLeave} 
              reviewerName={activeLeave.reviewedBy ? getUserById(activeLeave.reviewedBy)?.firstName || '' : ''} 
              isAdmin={isAdmin} 
            />
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

interface LeaveListProps {
  leaves: Leave[];
  openLeaveDetail: (leave: Leave) => void;
  getLeaveStatusIcon: (status: string) => React.ReactNode;
  formatLeaveDate: (leave: Leave) => string;
}

function LeaveList({ leaves, openLeaveDetail, getLeaveStatusIcon, formatLeaveDate }: LeaveListProps) {
  if (leaves.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No leave requests found</p>
          <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
        </CardContent>
      </Card>
    );
  }
  
  const sortedLeaves = [...leaves].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <Card>
      <ScrollArea className="h-[400px]">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sortedLeaves.map((leave) => (
              <div 
                key={leave.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => openLeaveDetail(leave)}
              >
                <div className="flex items-start gap-4 mb-2 md:mb-0">
                  <div className="mt-1">
                    {getLeaveStatusIcon(leave.status)}
                  </div>
                  <div>
                    <div className="font-medium">{formatLeaveDate(leave)}</div>
                    <div className="text-sm text-muted-foreground mt-1 max-w-md">{leave.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:ml-2">
                  <Badge variant="outline" className="capitalize bg-secondary">
                    {leave.type}
                  </Badge>
                  <Badge variant="outline" className={`capitalize 
                    ${leave.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    leave.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`
                  }>
                    {leave.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}