import React from "react";
import { cn } from "@/utils";

const variants = {
  default:
    "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-sm hover:shadow-lg",
  outline:
    "border border-gray-200 bg-white text-gray-900 hover:border-[var(--primary)] hover:text-[var(--primary)]",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11 p-0",
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] disabled:opacity-60 disabled:pointer-events-none",
          variants[variant] ?? variants.default,
          sizes[size] ?? sizes.md,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

