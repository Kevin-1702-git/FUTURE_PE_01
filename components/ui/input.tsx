import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-2 text-sm outline-none ring-offset-white placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-brand-primary dark:border-white/10 dark:bg-white/5 dark:ring-offset-stone-950",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
