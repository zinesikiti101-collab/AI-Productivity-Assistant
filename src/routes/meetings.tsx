import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Sparkles, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";
import { useAiGenerate } from "@/hooks/use-ai-generate";
import { PROMPTS } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Hub · AI Workplace" },
      { name: "description", content: "Turn raw meeting notes into summaries, decisions, risks, and action items." },
    ],
  }),
  component: Meetings,
});

const SAMPLE = `Attendees: Sara (PM), James (Eng), Priya (Design), Marcus (CX)
- James says the new billing service needs 2 more weeks; risk: Stripe webhook timing.
- Priya will deliver onboarding redesign mocks by next Friday.
- Marcus flagged 14 churn tickets tied to invoice clarity — needs copy fix.
- Decision: ship invoice copy fix in next hotfix (Sara owns).
- Decision: postpone enterprise SSO to Q4.
- Action: Sara to align with finance on tax line item by Wed.
`;

function Meetings() {
  const [notes, setNotes] = useState("");
  const { run, loading, output } = useAiGenerate();

  const generate = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes first");
    await run(PROMPTS.meeting.system, notes);
  };

  const exportMd = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "meeting-summary.md"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Meetings"
        title="Meeting Intelligence Hub"
        description="Drop your raw notes — get an executive summary, decisions, risks, action items, deadlines and owners."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Meeting Notes</h2>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setNotes(SAMPLE)}>Use sample</Button>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste attendees, topics, decisions, follow-ups…"
            className="min-h-[360px] bg-muted/30 border-border/60 resize-none"
          />
          <Button onClick={generate} disabled={loading} className="w-full mt-4 gradient-primary text-white border-0">
            <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Analyzing…" : "Generate Intelligence"}
          </Button>
        </Card>

        <Card className="glass border-border/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Summary</h2>
            {output && (
              <Button size="sm" variant="ghost" onClick={exportMd}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export .md
              </Button>
            )}
          </div>
          {!output && !loading && (
            <div className="text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg p-10 text-center">
              Structured meeting intelligence will appear here.
            </div>
          )}
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Extracting decisions and actions…</div>}
          {output && <Markdown>{output}</Markdown>}
        </Card>
      </div>
    </div>
  );
}
