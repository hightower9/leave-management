'use client';

import { format, parseISO, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Leave } from '@/lib/types';

interface LeaveDetailProps {
  leave: Leave;
  reviewerName: string;
  isAdmin: boolean;
}

export function LeaveDetail({ leave, reviewerName, isAdmin }: LeaveDetailProps) {
  const { toast } = useToast();
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const startDate = format(parseISO(leave.startDate), 'MMMM d, yyyy');
  const endDate = format(parseISO(leave.endDate), 'MMMM d, yyyy');
  const createdAt = format(parseISO(leave.createdAt), 'MMMM d, yyyy');
  
  const daysCount = differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1;
  
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the leave status in the mock database
      leave.status = 'approved';
      leave.reviewNote = reviewNote;
      leave.updatedAt = new Date().toISOString();
      
      toast({
        title: "Leave request approved",
        description: "The leave request has been approved successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to approve leave",
        description: "An error occurred while approving the leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the leave status in the mock database
      leave.status = 'rejected';
      leave.reviewNote = reviewNote;
      leave.updatedAt = new Date().toISOString();
      
      toast({
        title: "Leave request rejected",
        description: "The leave request has been rejected",
      });
    } catch (error) {
      toast({
        title: "Failed to reject leave",
        description: "An error occurred while rejecting the leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`capitalize 
          ${leave.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
          leave.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`
        }>
          {leave.status}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {leave.type} leave
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Date</div>
        <div className="font-medium">
          {startDate === endDate ? (
            <>
              {startDate} {leave.halfDay && `(${leave.halfDay})`}
            </>
          ) : (
            <>
              {startDate} - {endDate} ({daysCount} days)
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Reason</div>
        <div>{leave.reason}</div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Submitted on</div>
        <div>{createdAt}</div>
      </div>
      
      {leave.reviewedBy && (
        <>
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Reviewed by</div>
            <div>{reviewerName}</div>
          </div>
          
          {leave.reviewNote && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Review Note</div>
              <div>{leave.reviewNote}</div>
            </div>
          )}
        </>
      )}
      
      {isAdmin && leave.status === 'pending' && (
        <>
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Review Note (Optional)</div>
            <Textarea 
              placeholder="Add a note to the review decision"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950">
                  <XCircle size={16} />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Leave Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this leave request? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReject} disabled={isSubmitting}>
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button onClick={handleApprove} disabled={isSubmitting} className="gap-2">
              <CheckCircle size={16} />
              Approve
            </Button>
          </div>
        </>
      )}
    </div>
  );
}