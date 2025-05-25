'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Briefcase, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

function SidebarLink({ href, icon, label, isCollapsed }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 px-3',
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
          isCollapsed ? 'justify-center px-0' : ''
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
}

export function Sidebar() {
  const { isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCollapsed(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <aside
      className={cn(
        'fixed md:sticky top-0 left-0 z-30 flex flex-col h-screen bg-card border-r border-border transition-all duration-300',
        isCollapsed ? 'w-[70px]' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-14 px-3 flex items-center justify-between border-b border-border">
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                LT
              </div>
              <span className="font-bold">LeaveTrack</span>
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                LT
              </div>
            </div>
          )}

          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              className="ml-auto"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
          <SidebarLink 
            href="/dashboard" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/leaves" 
            icon={<CalendarDays size={20} />} 
            label="Leaves" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/projects" 
            icon={<Briefcase size={20} />} 
            label="Projects" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/profile" 
            icon={<User size={20} />} 
            label="Profile" 
            isCollapsed={isCollapsed} 
          />
          {isAdmin && (
            <>
              <SidebarLink 
                href="/users" 
                icon={<Users size={20} />} 
                label="Users" 
                isCollapsed={isCollapsed} 
              />
              <SidebarLink 
                href="/settings" 
                icon={<Settings size={20} />} 
                label="Settings" 
                isCollapsed={isCollapsed} 
              />
            </>
          )}
        </nav>

        <div className="mt-auto p-2">
          <Separator className="mb-2" />
          <div className={cn(
            'text-xs text-muted-foreground py-2',
            isCollapsed ? 'text-center' : 'px-2'
          )}>
            {!isCollapsed ? <span>© 2025 LeaveTrack</span> : <span>©</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}