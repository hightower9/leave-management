'use client';

import { format, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getLeavesByUserId } from '@/lib/data';
import { Leave } from '@/lib/types';

interface LeaveTableProps {
  userId: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }
}

function formatLeaveDate(leave: Leave) {
  const startDate = format(parseISO(leave.startDate), 'MMM d, yyyy');
  const endDate = format(parseISO(leave.endDate), 'MMM d, yyyy');
  
  if (startDate === endDate) {
    if (leave.halfDay) {
      return `${startDate} (${leave.halfDay})`;
    }
    return startDate;
  }
  
  return `${startDate} - ${endDate}`;
}

export function LeaveTable({ userId }: LeaveTableProps) {
  const leaves = getLeavesByUserId(userId);
  
  // Sort leaves by date (most recent first)
  const sortedLeaves = [...leaves].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  ).slice(0, 5); // Show only 5 most recent
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeaves.length > 0 ? (
            sortedLeaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{formatLeaveDate(leave)}</TableCell>
                <TableCell className="capitalize">{leave.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(leave.status)}>
                    {leave.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                No leave requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}