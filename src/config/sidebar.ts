import {
  LayoutDashboard,
  FileText,
  Settings,
  ClipboardList,
  Files,
  FormInput,
  Building2,
  Wind,
  Boxes,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react"
import { SidebarSection } from "@/types/sidebar"

export const sidebarConfig: SidebarSection[] = [
  {
    title: "Account Type/User",
    items: [
      {
        href: "/dashboard/new-project",
        label: "New Project",
        icon: Plus,
      },
      {
        href: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        label: "Projects",
        icon: FileText,
        href: "/dashboard/projects",
      },
      {
        label: "Turbines",
        icon: Wind,
        href: "/dashboard/turbines",
      },
      {
        label: "Platforms",
        icon: Building2,
        href: "/dashboard/platforms",
      },
      {
        label: "Sites",
        icon: Boxes,
        href: "/dashboard/sites",
      },
      {
        label: "Files",
        icon: Files,
        href: "/dashboard/files",
      },
    ],
  },
  {
    title: "Forms",
    items: [
      {
        label: "Forms",
        icon: FormInput,
        isCollapsible: true,
        items: [
          {
            label: "AWP",
            href: "/dashboard/forms/awp",
          },
          {
            label: "WI",
            href: "/dashboard/forms/wi",
          },
          {
            label: "MS",
            href: "/dashboard/forms/ms",
          },
        ],
      },
    ],
  },
  {
    title: "Tasks",
    items: [
      {
        label: "Tasks",
        icon: ClipboardList,
        isCollapsible: true,
        items: [
          {
            label: "My Tasks",
            href: "/dashboard/tasks/my-tasks",
          },
          {
            label: "All Tasks",
            href: "/dashboard/tasks/all",
          },
        ],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Aurai Turbines",
        icon: Wind,
        href: "/dashboard/aurai-turbines",
      },
      {
        label: "Support",
        icon: HelpCircle,
        href: "/dashboard/support",
      },
      {
        label: "Logout",
        icon: LogOut,
        href: "/auth/signout",
      },
    ],
  },
] 