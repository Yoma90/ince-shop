import React from "react";
import { cn } from "@/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gray-200/80",
        className
      )}
    />
  );
}

