import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "draft"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-500/20": variant === "default",
          "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20": variant === "success",
          "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20": variant === "warning",
          "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20": variant === "destructive",
          "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-500/20": variant === "draft",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
