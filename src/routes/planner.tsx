import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sparkles, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";
import { useAiGenerate } from "@/hooks/use-ai-generate";
import { PROMPTS } from "@/lib/prompts";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Task Planner · AI Workplace" },
      { name: "description", content: "Prioritize tasks with the Eisenhower matrix and get a time-blocked schedule." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const [tasks, setTasks] = useState<string[]>([
    "Prepare Q3 board deck",
    "Review pricing proposal from Acme",
    "1:1 with James",
    "Reply to investor update thread",
  ]);
  const [draft, setDraft] = useState("");
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily");
  const { run, loading, output } = useAiGenerate();

  const add = () => {
    if (!draft.trim()) return;
    setTasks([...tasks, draft.trim()]);
    setDraft("");
  };

  const remove = (i: number) => setTasks(tasks.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (tasks.length === 0) return toast.error("Add at least one task");
    await run(
      PROMPTS.planner.system,
      `Horizon: ${horizon}\n\nTasks:\n${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Focus"
        title="AI Priority Planner"
        description="Drop your tasks, pick a horizon, and let the AI sort, schedule, and coach."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Your tasks</h2>
            </div>
            <Tabs value={horizon} onValueChange={(v) => setHorizon(v as "daily" | "weekly")}>
              <TabsList className="bg-muted/30">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2 mb-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Add a task and press Enter…"
              className="bg-muted/30 border-border/60"
            />
            <Button onClick={add} variant="outline" className="border-border/60">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-muted/20 border border-border/60 px-3 py-2 text-sm">
                <span className="flex-1">{t}</span>
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            {tasks.length === 0 && <li className="text-sm text-muted-foreground">No tasks yet.</li>}
          </ul>

          <Button onClick={generate} disabled={loading} className="w-full mt-4 gradient-primary text-white border-0">
            <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Planning…" : `Generate ${horizon} plan`}
          </Button>
        </Card>

        <Card className="glass border-border/60 p-6">
          <h2 className="font-semibold mb-5">Prioritized plan</h2>
          {!output && !loading && (
            <div className="text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg p-10 text-center">
              Eisenhower matrix, schedule and productivity tips will appear here.
            </div>
          )}
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Building your plan…</div>}
          {output && <Markdown>{output}</Markdown>}
        </Card>
      </div>
    </div>
  );
}
