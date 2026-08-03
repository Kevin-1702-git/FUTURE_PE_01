import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand-primary/15 bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
