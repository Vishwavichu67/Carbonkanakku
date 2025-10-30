import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { dashboardNav } from "@/lib/constants";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen md:flex">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="bg-card border-r"
        >
          <SidebarHeader>
            <div className="group-data-[collapsible=icon]:hidden">
              <Logo />
            </div>
          </SidebarHeader>
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
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              <div className="hidden md:block font-headline text-xl font-bold">
                User Dashboard
              </div>
              <UserNav />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto bg-secondary/50">
            <div className="container py-8">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
