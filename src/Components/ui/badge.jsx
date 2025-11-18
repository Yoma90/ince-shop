import React from "react";
import { cn } from "@/utils";

export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900 bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

