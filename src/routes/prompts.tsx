import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { PROMPTS, type PromptDef } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Lab · AI Workplace" },
      { name: "description", content: "Inspect, refine and version-compare the prompts that power each feature." },
    ],
  }),
  component: PromptLab,
});

function PromptLab() {
  const ids = Object.keys(PROMPTS);
  const [active, setActive] = useState(ids[0]);
  const def: PromptDef = PROMPTS[active];
  const [draft, setDraft] = useState(def.system);

  const select = (id: string) => {
    setActive(id);
    setDraft(PROMPTS[id].system);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Prompt Engineering"
        title="AI Prompt Lab"
        description="Every feature in the Command Center is powered by a transparent prompt. Inspect, edit, and compare versions."
      />
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <Card className="glass border-border/60 p-3 h-fit">
          <ul className="space-y-1">
            {ids.map((id) => (
              <li key={id}>
                <button
                  onClick={() => select(id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition",
                    id === active
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "hover:bg-muted/40 text-muted-foreground border border-transparent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span className="truncate">{PROMPTS[id].title}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-border/60 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-semibold text-lg">{def.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{def.description}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded">
                {def.id}
              </span>
            </div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">System Prompt</label>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-1.5 min-h-[260px] bg-muted/30 border-border/60 font-mono text-xs"
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                className="border-border/60"
                onClick={() => toast.success("Refinement saved for this session", { description: "Changes apply to the next run on this page." })}
              >
                <Save className="h-4 w-4 mr-2" /> Save refinement
              </Button>
            </div>
          </Card>

          {def.versions && def.versions.length > 0 && (
            <Card className="glass border-border/60 p-6">
              <h3 className="font-semibold mb-4">Version comparison</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {def.versions.map((v) => (
                  <div key={v.label} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2">{v.label}</p>
                    <pre className="whitespace-pre-wrap text-xs text-foreground/85 font-mono leading-relaxed">{v.system}</pre>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
