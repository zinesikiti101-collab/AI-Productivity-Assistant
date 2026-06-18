import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Workflow as WorkflowIcon, Check, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";
import { useServerFn } from "@tanstack/react-start";
import { generateContent } from "@/lib/ai.functions";
import { PROMPTS } from "@/lib/prompts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow Automation · AI Workplace" },
      { name: "description", content: "Five-step AI workflow: meeting → summary → actions → schedule → email → report." },
    ],
  }),
  component: WorkflowPage,
});

type StepKey = "summary" | "actions" | "schedule" | "email" | "report";
type StepState = "idle" | "running" | "done" | "error";

const STEPS: { key: StepKey; title: string; prompt: typeof PROMPTS.workflow_summary }[] = [
  { key: "summary", title: "Summarize meeting", prompt: PROMPTS.workflow_summary },
  { key: "actions", title: "Extract action items", prompt: PROMPTS.workflow_actions },
  { key: "schedule", title: "Build task schedule", prompt: PROMPTS.workflow_schedule },
  { key: "email", title: "Draft follow-up email", prompt: PROMPTS.workflow_email },
  { key: "report", title: "Generate management report", prompt: PROMPTS.workflow_report },
];

function WorkflowPage() {
  const fn = useServerFn(generateContent);
  const [notes, setNotes] = useState("");
  const [states, setStates] = useState<Record<StepKey, StepState>>({
    summary: "idle", actions: "idle", schedule: "idle", email: "idle", report: "idle",
  });
  const [outputs, setOutputs] = useState<Record<StepKey, string>>({
    summary: "", actions: "", schedule: "", email: "", report: "",
  });
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (notes.trim().length < 30) return toast.error("Paste meeting notes first");
    setRunning(true);
    setStates({ summary: "idle", actions: "idle", schedule: "idle", email: "idle", report: "idle" });
    setOutputs({ summary: "", actions: "", schedule: "", email: "", report: "" });
    let context = notes;
    try {
      for (const step of STEPS) {
        setStates((s) => ({ ...s, [step.key]: "running" }));
        const res = await fn({ data: { system: step.prompt.system, prompt: context } });
        setOutputs((o) => ({ ...o, [step.key]: res.text }));
        setStates((s) => ({ ...s, [step.key]: "done" }));
        context = `Original meeting notes:\n${notes}\n\nPrevious step output:\n${res.text}`;
      }
      toast.success("Workflow complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Workflow failed";
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Automation"
        title="AI Workflow Automation"
        description="Paste meeting notes once. Watch the AI run five chained steps to deliver a complete management package."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="glass border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <WorkflowIcon className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Input — meeting notes</h2>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste raw meeting notes…"
            className="min-h-[280px] bg-muted/30 border-border/60 resize-none"
          />
          <Button onClick={run} disabled={running} className="w-full mt-4 gradient-primary text-white border-0">
            <Sparkles className="h-4 w-4 mr-2" /> {running ? "Running workflow…" : "Run Full Workflow"}
          </Button>

          <ol className="mt-6 space-y-3">
            {STEPS.map((s, i) => {
              const st = states[s.key];
              return (
                <li key={s.key} className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-lg grid place-items-center border text-xs font-semibold",
                    st === "done" && "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
                    st === "running" && "bg-primary/20 border-primary/40 text-primary",
                    st === "idle" && "bg-muted/30 border-border text-muted-foreground",
                  )}>
                    {st === "done" ? <Check className="h-4 w-4" />
                      : st === "running" ? <Loader2 className="h-4 w-4 animate-spin" />
                      : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{st}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {STEPS.map((s, i) => {
            const out = outputs[s.key];
            const st = states[s.key];
            return (
              <Card key={s.key} className={cn(
                "glass border-border/60 p-5 transition",
                st === "running" && "border-primary/40 glow",
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Step {i + 1}</span>
                  <h3 className="font-semibold text-sm">{s.title}</h3>
                </div>
                {out ? <Markdown>{out}</Markdown> : (
                  <p className="text-xs text-muted-foreground">
                    {st === "running" ? "Generating…" : "Awaiting previous step."}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
