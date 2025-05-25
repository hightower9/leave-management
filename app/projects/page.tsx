'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar, Users, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { projects, getUsersByProjectId } from '@/lib/data';
import { ProjectForm } from '@/components/projects/project-form';

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
        
        <div className="flex items-center gap-2">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "Try adjusting your search query" 
                      : isAdmin 
                        ? "Create a new project to get started" 
                        : "You are not assigned to any projects yet"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const projectMembers = getUsersByProjectId(project.id);
              
              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-primary/5 dark:bg-primary/10">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.notes || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-sm">
                          {projectMembers.length} team {projectMembers.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {projectMembers.slice(0, 3).map((member) => (
                          <Badge variant="outline" key={member.id}>
                            {member.firstName} {member.lastName}
                          </Badge>
                        ))}
                        {projectMembers.length > 3 && (
                          <Badge variant="outline">
                            +{projectMembers.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => navigateToProject(project.id)}
                    >
                      <Calendar size={14} />
                      View Calendar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigateToProject(project.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}