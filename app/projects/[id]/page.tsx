
'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { projects, getUsersByProjectId, getLeavesByUserId } from '@/lib/data';
import { ProjectCalendar } from '@/components/projects/project-calendar';
import { ProjectForm } from '@/components/projects/project-form';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!user) {
    router.push('/');
    return null;
  }

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/projects')}>
            Go Back to Projects
          </Button>
        </div>
      </MainLayout>
    );
  }

  const members = getUsersByProjectId(id);

  const handleDeleteProject = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const projectIndex = projects.findIndex(p => p.id === id);
      if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
      }
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully",
      });
      router.push('/projects');
    } catch (error) {
      toast({
        title: "Failed to delete project",
        description: "An error occurred while deleting the project",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push('/projects')}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.notes || "No description provided"}
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Pencil size={16} />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm onClose={() => setIsFormOpen(false)} projectId={id} />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this project? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {members.length} members assigned to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No members assigned to this project
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => {
                    const memberLeaves = getLeavesByUserId(member.id);
                    const approvedLeaves = memberLeaves.filter(leave => leave.status === 'approved').length;
                    const pendingLeaves = memberLeaves.filter(leave => leave.status === 'pending').length;

                    return (
                      <div key={member.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.jobDescription}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {approvedLeaves > 0 && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {approvedLeaves} approved leaves
                            </Badge>
                          )}
                          {pendingLeaves > 0 && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {pendingLeaves} pending
                            </Badge>
                          )}
                          {approvedLeaves === 0 && pendingLeaves === 0 && (
                            <Badge variant="outline">
                              No leaves
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                View team member availabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectCalendar projectId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
