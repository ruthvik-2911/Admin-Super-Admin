import * as React from "react"
import { Badge } from "./Badge"
import type { AdStatus } from "../../services/ads"

interface StatusBadgeProps {
  status: AdStatus | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case "active":
      case "approved":
        return "success"
      case "pending":
      case "draft":
        return "warning"
      case "expired":
      case "suspended":
      case "rejected":
        return "danger"
      default:
        return "neutral"
    }
  }

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  )
}
