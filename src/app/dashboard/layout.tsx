import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { dashboardNav } from "@/lib/constants";
import { LogOut, Settings } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <SiteHeader />
        <div className="flex">
          <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="bg-card border-r h-[calc(100vh-4rem)] sticky top-16"
          >
            <SidebarContent>
              <SidebarMenu>
                {dashboardNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={{ children: item.title }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{children: 'Log Out'}}>
                        <Link href="/">
                            <LogOut />
                            <span>Log Out</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 bg-secondary/50">
            <div className="container py-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
