import { LucideIcon } from "lucide-react"

export interface SidebarItem {
  href?: string
  label: string
  icon?: LucideIcon
  items?: SidebarItem[]
  isCollapsible?: boolean
  isDisabled?: boolean
  badge?: string
}

export interface SidebarSection {
  title: string
  items: SidebarItem[]
} 