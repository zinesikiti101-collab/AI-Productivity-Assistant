import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          <span className="gradient-text">{title}</span>
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
