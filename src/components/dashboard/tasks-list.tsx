"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const tasks = [
  {
    id: "TASK-1234",
    title: "Review Maintenance Schedule",
    status: "High",
    assignee: "John Doe",
    dueDate: "2024-01-30",
  },
  {
    id: "TASK-1235",
    title: "Update Safety Protocols",
    status: "Medium",
    assignee: "Jane Smith",
    dueDate: "2024-02-01",
  },
  
]

export function TasksList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell>
              <Badge
                variant={
                  task.status === "High"
                    ? "destructive"
                    : task.status === "Medium"
                    ? "default"
                    : "secondary"
                }
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>{task.dueDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 