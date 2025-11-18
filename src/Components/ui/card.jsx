import React from "react";
import { cn } from "@/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-gray-100 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("p-6 pb-2", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("p-6 pt-2 text-sm text-gray-600", className)}
      {...props}
    />
  );
}

