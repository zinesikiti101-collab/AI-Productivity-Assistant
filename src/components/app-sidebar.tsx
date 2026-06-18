import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  CalendarClock,
  ListChecks,
  FileSearch,
  Workflow,
  MessageSquare,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const productivity = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Studio", url: "/email", icon: Mail },
  { title: "Meeting Hub", url: "/meetings", icon: CalendarClock },
  { title: "Task Planner", url: "/planner", icon: ListChecks },
  { title: "Research", url: "/research", icon: FileSearch },
];

const intelligence = [
  { title: "Workflow Automation", url: "/workflow", icon: Workflow },
  { title: "AI Chatbot", url: "/chat", icon: MessageSquare },
  { title: "Prompt Lab", url: "/prompts", icon: FlaskConical },
  { title: "Responsible AI", url: "/responsible", icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderGroup = (label: string, items: typeof productivity) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                className="data-[active=true]:bg-primary/15 data-[active=true]:text-foreground data-[active=true]:border-primary/30 border border-transparent rounded-lg"
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Command Center</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              AI Workplace
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {renderGroup("Productivity", productivity)}
        {renderGroup("Intelligence", intelligence)}
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4">
        <div className="glass rounded-xl p-3 text-xs">
          <p className="font-medium text-foreground">Pro tip</p>
          <p className="text-muted-foreground mt-1">
            Always review AI output before sending or acting on it.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
