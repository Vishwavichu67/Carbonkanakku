import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { dashboardNav } from "@/lib/constants";
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
          </Sidebar>
          <main className="flex-1 bg-secondary/50">
            <div className="container py-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
