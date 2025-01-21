"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Calendar,
  MoreHorizontal,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

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

export function TaskGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="group relative">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[task.status as keyof typeof statusVariants]}>
                    {task.status}
                  </Badge>
                  <Badge variant={priorityVariants[task.priority as keyof typeof priorityVariants]}>
                    {task.priority}
                  </Badge>
                </div>
                <h3 className="font-semibold">{task.title}</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
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
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>
                  {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {task.assignee.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {task.project}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 