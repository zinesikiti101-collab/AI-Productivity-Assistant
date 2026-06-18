import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        "prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-h2:uppercase prose-h2:tracking-[0.18em] prose-h2:text-muted-foreground",
        "prose-h3:text-sm prose-h3:text-foreground",
        "prose-p:text-foreground/90 prose-li:text-foreground/90",
        "prose-strong:text-foreground prose-a:text-primary",
        "prose-table:text-sm prose-th:text-foreground prose-td:text-foreground/90",
        "prose-code:text-accent prose-code:bg-muted/40 prose-code:px-1 prose-code:rounded",
        className,
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
