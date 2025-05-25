
'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { projects, getUsersByProjectId } from '@/lib/data';
import { ProjectForm } from '@/components/projects/project-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ProjectsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!user) {
    return null;
  }

  // Filter projects by user access (all for admin, only assigned for members)
  const accessibleProjects = isAdmin 
    ? projects 
    : projects.filter(project => project.members.includes(user.id));

  // Filter projects by search query
  const filteredProjects = accessibleProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage projects and team availability
            </p>
          </div>

          {isAdmin && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add details for the new project and assign team members
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Try adjusting your search query" 
                          : isAdmin 
                            ? "Create a new project to get started" 
                            : "You are not assigned to any projects yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => {
                  const memberCount = getUsersByProjectId(project.id).length;
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.notes || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {memberCount} {memberCount === 1 ? 'member' : 'members'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => navigateToProject(project.id)}
                        >
                          View Project
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
