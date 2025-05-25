'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlusIcon, Search, Users, MailPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { users, getProjectsByUserId, calculateLeaveSummary } from '@/lib/data';
import { UserForm } from '@/components/users/user-form';
import { InviteForm } from '@/components/users/invite-form';

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Redirect non-admin users
  if (!isAdmin) {
    router.push('/dashboard');
    return null;
  }
  
  // Filter users by search query
  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handleEditUser = (userId: string) => {
    setSelectedUser(userId);
    setIsUserFormOpen(true);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and leave quotas
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlusIcon size={16} />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                </DialogHeader>
                <UserForm 
                  onClose={() => {
                    setIsUserFormOpen(false);
                    setSelectedUser(null);
                  }} 
                  userId={selectedUser} 
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isInviteFormOpen} onOpenChange={setIsInviteFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MailPlus size={16} />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                </DialogHeader>
                <InviteForm onClose={() => setIsInviteFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  {users.length} {users.length === 1 ? 'user' : 'users'} total
                </CardDescription>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Leave Quota</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((u) => {
                      const userProjects = getProjectsByUserId(u.id);
                      const leaveSummary = calculateLeaveSummary(u.id);
                      
                      return (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="font-medium">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {u.email}
                            </div>
                          </TableCell>
                          <TableCell>{u.jobDescription}</TableCell>
                          <TableCell>
                            {userProjects.length === 0 ? (
                              <span className="text-muted-foreground text-sm">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {userProjects.map(project => (
                                  <Badge key={project.id} variant="outline">
                                    {project.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span>{leaveSummary.used}/{u.annualLeaveQuota}</span>
                              <span className="text-muted-foreground">used</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditUser(u.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}