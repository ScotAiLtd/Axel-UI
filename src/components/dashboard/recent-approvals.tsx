"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentApprovals = [
  {
    id: "1",
    document: "Turbine Maintenance Report - T247",
    approver: "John Smith",
    approverImage: "/avatars/01.png",
    status: "Approved",
    date: "2025-01-21",
  },
  {
    id: "2",
    document: "Safety Inspection - Site A",
    approver: "Emma Wilson",
    approverImage: "/avatars/02.png",
    status: "Pending",
    date: "2025-01-21",
  },
 
]

export function RecentApprovals() {
  return (
    <div className="space-y-8">
      {recentApprovals.map((approval) => (
        <div key={approval.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={approval.approverImage} alt="Avatar" />
            <AvatarFallback>
              {approval.approver.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{approval.document}</p>
            <p className="text-sm text-muted-foreground">
              Approved by {approval.approver}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {approval.status === "Approved" ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-yellow-500">⋯</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 