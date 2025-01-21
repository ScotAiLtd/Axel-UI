"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  User2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tasks = [
  {
    id: "TASK-1234",
    title: "Turbine Maintenance Check - T247",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-25",
    assignee: {
      name: "John Smith",
      avatar: "/avatars/01.png",
    },
    project: "North Sea Wind Farm",
    progress: 65,
  },
  {
    id: "TASK-1235",
    title: "Safety Protocol Review",
    status: "review",
    priority: "medium",
    dueDate: "2025-01-28",
    assignee: {
      name: "Emma Wilson",
      avatar: "/avatars/02.png",
    },
    project: "Baltic Sea Platform",
    progress: 90,
  },
]

const statusVariants = {
  open: "default",
  "in-progress": "warning",
  review: "default",
  completed: "success",
} as const

const priorityVariants = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const

export function TaskList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Task ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Project</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-mono text-xs">{task.id}</TableCell>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <Badge variant={statusVariants[task.status as keyof typeof statusVariants]}>
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={priorityVariants[task.priority as keyof typeof priorityVariants]}>
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Assigned to {task.assignee.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {task.project}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                  <DropdownMenuItem>Reassign</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 