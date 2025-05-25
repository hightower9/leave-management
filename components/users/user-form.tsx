'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { projects, users } from '@/lib/data';
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
import { UserRole } from '@/lib/types';

interface UserFormProps {
  onClose: () => void;
  userId: string | null;
}

export function UserForm({ onClose, userId }: UserFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If userId is provided, find the user for editing
  const existingUser = userId ? users.find(u => u.id === userId) : null;
  
  const [firstName, setFirstName] = useState(existingUser?.firstName || '');
  const [lastName, setLastName] = useState(existingUser?.lastName || '');
  const [email, setEmail] = useState(existingUser?.email || '');
  const [jobDescription, setJobDescription] = useState(existingUser?.jobDescription || '');
  const [role, setRole] = useState<UserRole>(existingUser?.role || 'member');
  const [annualLeaveQuota, setAnnualLeaveQuota] = useState(existingUser?.annualLeaveQuota || 20);
  const [notes, setNotes] = useState(existingUser?.notes || '');
  const [selectedProjects, setSelectedProjects] = useState<string[]>(existingUser?.projects || []);
  const [isProjectsPopoverOpen, setIsProjectsPopoverOpen] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !jobDescription.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Mock API call - in a real app, this would be a server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (existingUser) {
        // Update existing user
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.email = email;
        existingUser.jobDescription = jobDescription;
        existingUser.role = role;
        existingUser.annualLeaveQuota = annualLeaveQuota;
        existingUser.notes = notes;
        existingUser.projects = selectedProjects;
        
        toast({
          title: "User updated",
          description: "The user has been updated successfully",
        });
      } else {
        // Create new user
        const newUser = {
          id: (users.length + 1).toString(),
          firstName,
          lastName,
          email,
          jobDescription,
          role,
          annualLeaveQuota,
          notes,
          projects: selectedProjects,
        };
        
        users.push(newUser as any);
        
        toast({
          title: "User created",
          description: "The new user has been created successfully",
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to save user",
        description: "An error occurred while saving the user information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollArea className="max-h-[80vh]">
      <form onSubmit={handleSubmit} className="space-y-4 px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Title</Label>
          <Input 
            id="jobDescription" 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup 
            defaultValue={role} 
            className="flex gap-4"
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="member" id="member" />
              <Label htmlFor="member">Member</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="annualLeaveQuota">Annual Leave Quota (Days)</Label>
          <Input 
            id="annualLeaveQuota" 
            type="number" 
            min="0"
            value={annualLeaveQuota}
            onChange={(e) => setAnnualLeaveQuota(parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Assigned Projects</Label>
          <Popover open={isProjectsPopoverOpen} onOpenChange={setIsProjectsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isProjectsPopoverOpen}
                className="w-full justify-between"
              >
                {selectedProjects.length > 0
                  ? `${selectedProjects.length} projects selected`
                  : "Select projects"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search projects..." />
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.id}
                      onSelect={() => {
                        setSelectedProjects(prev => 
                          prev.includes(project.id)
                            ? prev.filter(id => id !== project.id)
                            : [...prev, project.id]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProjects.includes(project.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {project.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedProjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProjects.map(projectId => {
                const project = projects.find(p => p.id === projectId);
                if (!project) return null;
                
                return (
                  <Badge key={projectId} variant="secondary" className="gap-1">
                    {project.name}
                    <button 
                      type="button"
                      onClick={() => setSelectedProjects(prev => prev.filter(id => id !== projectId))}
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
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Additional notes about this user"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : existingUser ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}