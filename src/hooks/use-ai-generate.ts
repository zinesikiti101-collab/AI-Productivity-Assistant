import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateContent } from "@/lib/ai.functions";
import { toast } from "sonner";

export function useAiGenerate() {
  const fn = useServerFn(generateContent);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async (system: string, prompt: string) => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { system, prompt } });
      setOutput(res.text);
      return res.text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error("AI request failed", { description: msg });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, output, setOutput };
}
