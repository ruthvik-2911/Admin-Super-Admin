import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400",
    success: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
