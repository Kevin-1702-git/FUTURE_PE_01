import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-brand-primary dark:border-white/10 dark:bg-white/5",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
