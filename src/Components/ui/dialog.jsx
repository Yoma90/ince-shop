import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const handler = (event) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10 w-full max-w-3xl">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogContent({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ className, children }) {
  return (
    <div className={cn("space-y-2 border-b border-gray-100 pb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }) {
  return (
    <h2 className={cn("text-2xl font-bold text-gray-900", className)}>
      {children}
    </h2>
  );
}

