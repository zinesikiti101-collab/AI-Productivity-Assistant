import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";
import { useAiGenerate } from "@/hooks/use-ai-generate";
import { PROMPTS } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant · AI Workplace" },
      { name: "description", content: "Summarize reports into key insights, risks, opportunities, and recommendations." },
    ],
  }),
  component: Research,
});

function Research() {
  const [doc, setDoc] = useState("");
  const { run, loading, output } = useAiGenerate();

  const generate = async () => {
    if (doc.trim().length < 100) return toast.error("Paste at least a few paragraphs to analyze");
    await run(PROMPTS.research.system, doc);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Insights"
        title="Research Intelligence Assistant"
        description="Drop any report, article, or transcript. Get an executive brief with insights, opportunities, risks and recommendations."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border/60 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileSearch className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Source document</h2>
          </div>
          <Textarea
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            placeholder="Paste a report, article, transcript, or memo…"
            className="min-h-[420px] bg-muted/30 border-border/60 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{doc.length.toLocaleString()} characters</span>
            <Button onClick={generate} disabled={loading} className="gradient-primary text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Analyzing…" : "Generate Brief"}
            </Button>
          </div>
        </Card>

        <Card className="glass border-border/60 p-6">
          <h2 className="font-semibold mb-5">Intelligence brief</h2>
          {!output && !loading && (
            <div className="text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg p-10 text-center">
              Insights, opportunities, risks and recommendations will appear here.
            </div>
          )}
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Reading and synthesizing…</div>}
          {output && <Markdown>{output}</Markdown>}
        </Card>
      </div>
    </div>
  );
}
