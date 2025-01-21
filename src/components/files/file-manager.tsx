"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  File,
  FileText,
  FileImage,
  FileCheck,
  Archive,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  History,
  AlertCircle
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { format } from "date-fns"


const files = [
  {
    id: "1",
    name: "Technical_Specification_v2.pdf",
    type: "pdf",
    size: "2.4 MB",
    category: "projects",
    project: "North Sea Wind Farm",
    uploadedBy: "John Doe",
    uploadedAt: "2024-03-15T10:30:00",
    status: "accepted",
    version: "2.0",
    comments: [
      {
        user: "Sarah Smith",
        text: "Approved - meets all requirements",
        timestamp: "2024-03-16T14:20:00"
      }
    ]
  },
  {
    id: "2",
    name: "Environmental_Impact_Report.pdf",
    type: "pdf",
    size: "5.8 MB",
    category: "sites",
    project: "Baltic Sea Platform",
    uploadedBy: "Emma Wilson",
    uploadedAt: "2024-03-14T09:15:00",
    status: "in-review",
    version: "1.0",
    comments: [
      {
        user: "Michael Chen",
        text: "Reviewing section 3.2 - will provide feedback",
        timestamp: "2024-03-15T11:30:00"
      }
    ]
  },
  {
    id: "3",
    name: "Maintenance_Schedule_2024.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    category: "turbines",
    project: "Irish Sea Array",
    uploadedBy: "Robert Johnson",
    uploadedAt: "2024-03-13T15:45:00",
    status: "accepted",
    version: "1.1",
    comments: [
      {
        user: "David Brown",
        text: "Schedule approved for Q2 2024",
        timestamp: "2024-03-14T10:20:00"
      }
    ]
  },
  {
    id: "4",
    name: "Platform_Design_Specs.dwg",
    type: "cad",
    size: "8.5 MB",
    category: "platforms",
    project: "North Sea Wind Farm",
    uploadedBy: "Alice Cooper",
    uploadedAt: "2024-03-12T14:30:00",
    status: "rejected",
    version: "3.2",
    comments: [
      {
        user: "Tom Wilson",
        text: "Design needs revision - check structural calculations",
        timestamp: "2024-03-13T09:45:00"
      }
    ]
  },
  {
    id: "5",
    name: "Safety_Protocols_2024.pdf",
    type: "pdf",
    size: "3.1 MB",
    category: "projects",
    project: "Baltic Sea Platform",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-03-11T11:20:00",
    status: "accepted",
    version: "2.1",
    comments: [
      {
        user: "Mark Davis",
        text: "Protocols meet all safety requirements",
        timestamp: "2024-03-12T16:15:00"
      }
    ]
  }
]

interface FileManagerProps {
  category: "all" | "projects" | "sites" | "turbines"
  className?: string
}

export function FileManager({ category, className }: FileManagerProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileCheck className="h-8 w-8 text-red-500" />
      case "image":
        return <FileImage className="h-8 w-8 text-blue-500" />
      case "archive":
        return <Archive className="h-8 w-8 text-yellow-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      uploading: { variant: "secondary", label: "Uploading..." },
      accepted: { variant: "default", label: "Accepted" },
      "in-review": { variant: "outline", label: "In Review" },
      rejected: { variant: "destructive", label: "Rejected" }
    }

    const { variant, label } = variants[status] || variants["in-review"]
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy")
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(
        "grid gap-4",
        viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {files.map((file) => (
          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getFileIcon(file.type)}
                    <div className="space-y-1">
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {file.project} • {file.size}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="mr-2 h-4 w-4" />
                        Version History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">v{file.version}</span>
                      <span>•</span>
                      <span className="text-muted-foreground">
                        {formatDate(file.uploadedAt)}
                      </span>
                    </div>
                    {getStatusBadge(file.status)}
                  </div>

                  {file.status === "rejected" && (
                    <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                      <p className="text-destructive">Changes required: Please review comments</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 