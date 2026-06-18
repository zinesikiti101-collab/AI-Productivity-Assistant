import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  CalendarClock,
  ListChecks,
  FileSearch,
  Workflow,
  Sparkles,
  TrendingUp,
  Brain,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · AI Workplace Command Center" },
      {
        name: "description",
        content: "Your AI workspace at a glance — tasks, emails, meetings and research insights.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Pending Tasks", value: 12, delta: "+3 today", icon: ListChecks, color: "from-indigo-500 to-violet-500" },
  { label: "Emails Drafted", value: 28, delta: "this week", icon: Mail, color: "from-cyan-400 to-sky-500" },
  { label: "Meetings Summarized", value: 9, delta: "+2 today", icon: CalendarClock, color: "from-fuchsia-500 to-pink-500" },
  { label: "Research Briefs", value: 6, delta: "this month", icon: FileSearch, color: "from-emerald-400 to-teal-500" },
];

const activities = [
  { icon: Mail, title: "Drafted follow-up to Acme Corp", time: "2m ago", tag: "Email" },
  { icon: CalendarClock, title: "Summarized Q3 Planning sync", time: "18m ago", tag: "Meeting" },
  { icon: ListChecks, title: "Prioritized 14 tasks for tomorrow", time: "1h ago", tag: "Planner" },
  { icon: FileSearch, title: "Brief: Competitor pricing analysis", time: "3h ago", tag: "Research" },
  { icon: Workflow, title: "Auto-workflow: meeting → email", time: "Yesterday", tag: "Workflow" },
];

const quickActions = [
  { to: "/email", label: "Draft Email", icon: Mail },
  { to: "/meetings", label: "Summarize Meeting", icon: CalendarClock },
  { to: "/planner", label: "Plan My Day", icon: ListChecks },
  { to: "/research", label: "Brief a Document", icon: FileSearch },
  { to: "/workflow", label: "Run Workflow", icon: Workflow },
];

function Dashboard() {
  const productivity = 78;
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Workspace"
        title="Good afternoon — here's your command center"
        description="A live view of what your AI assistant has produced, what's pending, and where to focus next."
        actions={
          <Link to="/workflow">
            <Button className="gradient-primary text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" /> Run AI Workflow
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="glass border-border/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-semibold mt-2">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.delta}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} grid place-items-center`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Recent AI Activity</h2>
            </div>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <ul className="divide-y divide-border/60">
            {activities.map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <div className="h-9 w-9 rounded-lg bg-muted/40 grid place-items-center">
                  <a.icon className="h-4 w-4 text-foreground/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {a.time}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-primary/15 text-primary border border-primary/20">
                  {a.tag}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-border/60 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">Productivity Score</h2>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-semibold gradient-text">{productivity}</span>
              <span className="text-sm text-muted-foreground mb-2">/ 100</span>
            </div>
            <Progress value={productivity} className="h-2" />
            <p className="text-xs text-muted-foreground mt-3">
              You shipped 6 deliverables today. AI saved you an estimated 2h 40m.
            </p>
          </Card>

          <Card className="glass border-border/60 p-6">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((q) => (
                <Link key={q.to} to={q.to}>
                  <Button variant="outline" className="w-full justify-start border-border/60 bg-muted/20 hover:bg-primary/10 hover:border-primary/40">
                    <q.icon className="h-4 w-4 mr-2" /> {q.label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
