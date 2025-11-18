import React from "react";
import { cn } from "@/utils";

export const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-semibold text-gray-800", className)}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

