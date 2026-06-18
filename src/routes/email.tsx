import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Markdown } from "@/components/markdown";
import { useAiGenerate } from "@/hooks/use-ai-generate";
import { PROMPTS } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Studio · AI Workplace" },
      { name: "description", content: "Generate professional emails with tone and audience control." },
    ],
  }),
  component: EmailStudio,
});

const tones = ["Formal", "Friendly", "Persuasive", "Executive", "Customer Support"];
const audiences = ["Client", "Manager", "Team Member", "Stakeholder"];

function EmailStudio() {
  const [tone, setTone] = useState("Executive");
  const [audience, setAudience] = useState("Client");
  const [topic, setTopic] = useState("");
  const { run, loading, output, setOutput } = useAiGenerate();

  const generate = async () => {
    if (!topic.trim()) return toast.error("Describe what the email is about");
    await run(
      PROMPTS.email.system,
      `Tone: ${tone}\nAudience: ${audience}\n\nTopic / context:\n${topic}`,
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Communications"
        title="Email Studio"
        description="Draft polished, on-brand emails in seconds. Pick a tone, choose your audience, edit freely."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border/60 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Compose</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1.5 bg-muted/30 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>{tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="mt-1.5 bg-muted/30 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>{audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">What is the email about?</Label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Follow up after the discovery call with Acme. Confirm next steps and share the proposal timeline."
                className="mt-1.5 min-h-[180px] bg-muted/30 border-border/60 resize-none"
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full gradient-primary text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </Card>

        <Card className="glass border-border/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Draft</h2>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
              </Button>
            )}
          </div>
          {!output && !loading && (
            <div className="text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg p-10 text-center">
              Your generated email will appear here. You can edit it directly.
            </div>
          )}
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Crafting your email…</div>}
          {output && (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="min-h-[420px] bg-muted/30 border-border/60 font-mono text-sm"
            />
          )}
          <p className="text-[11px] text-muted-foreground mt-3">
            AI-generated. Always review before sending.
          </p>
        </Card>
      </div>
      <Markdown>{""}</Markdown>
    </div>
  );
}
