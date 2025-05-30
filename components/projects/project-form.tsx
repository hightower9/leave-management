
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { users, projects } from '@/lib/data';

interface ProjectFormProps {
  onClose: () => void;
  projectId?: string;
}

export function ProjectForm({ onClose, projectId }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const safeProjects = projects ?? [];
  const safeUsers = users ?? [];
  const memberUsers = safeUsers.filter(user => user.role === 'member');
  
  const existingProject = projectId ? safeProjects.find(p => p.id === projectId) : null;
  
  const [projectName, setProjectName] = useState(existingProject?.name || '');
  const [projectNotes, setProjectNotes] = useState(existingProject?.notes || '');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(existingProject?.members || []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!projectName.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide a project name",
          variant: "destructive",
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (existingProject) {
        existingProject.name = projectName;
        existingProject.notes = projectNotes;
        existingProject.members = selectedMembers;
        existingProject.updatedAt = new Date().toISOString();
        
        toast({
          title: "Project updated",
          description: "The project has been updated successfully",
        });
      } else {
        const newProject = {
          id: (safeProjects.length + 1).toString(),
          name: projectName,
          notes: projectNotes,
          members: selectedMembers,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        safeProjects.push(newProject);
        
        toast({
          title: "Project created",
          description: "The new project has been created successfully",
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input 
          id="projectName" 
          placeholder="Enter project name" 
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectNotes">Description</Label>
        <Textarea 
          id="projectNotes" 
          placeholder="Project description or notes"
          value={projectNotes}
          onChange={(e) => setProjectNotes(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Team Members</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedMembers.length > 0
                ? `${selectedMembers.length} members selected`
                : "Select team members"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {memberUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      setSelectedMembers(prev => 
                        prev.includes(user.id)
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedMembers.includes(user.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.firstName} {user.lastName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMembers.map(memberId => {
              const member = memberUsers.find(u => u.id === memberId);
              if (!member) return null;
              
              return (
                <Badge key={memberId} variant="secondary" className="gap-1">
                  {member.firstName} {member.lastName}
                  <button 
                    type="button"
                    onClick={() => setSelectedMembers(prev => prev.filter(id => id !== memberId))}
                    className="ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : existingProject ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
