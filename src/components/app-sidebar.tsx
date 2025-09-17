'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  CalendarClock,
  MapPin,
  Truck,
  Megaphone,
  ShoppingBag,
  BookOpen,
  Users,
  LogOut,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/schedule-pickup',
    label: 'Schedule Pickup',
    icon: CalendarClock,
  },
  {
    href: '/locate-facilities',
    label: 'Locate Facilities',
    icon: MapPin,
  },
  {
    href: '/track-vehicles',
    label: 'Track Vehicles',
    icon: Truck,
  },
  {
    href: '/report-issue',
    label: 'Report an Issue',
    icon: Megaphone,
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    icon: ShoppingBag,
  },
  {
    href: '/training',
    label: 'Training',
    icon: BookOpen,
  },
  {
    href: '/community-events',
    label: 'Community Events',
    icon: Users,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-sidebar-primary" />
          {state === 'expanded' && (
            <h2 className="text-xl font-bold text-sidebar-foreground">
              Eco Snap Sort
            </h2>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={{ children: link.label }}
              >
                <a href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Settings' }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Logout' }}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="size-9">
            <AvatarImage
              src="https://picsum.photos/seed/avatar/100/100"
              alt="User"
            />
            <AvatarFallback>GC</AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="overflow-hidden">
              <p className="truncate font-semibold text-sidebar-foreground">
                Green Champion
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                citizen@example.com
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
