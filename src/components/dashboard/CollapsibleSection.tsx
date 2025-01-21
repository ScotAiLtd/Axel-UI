"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarItem } from "@/types/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface CollapsibleSectionProps {
  item: SidebarItem
  isExpanded: boolean
}

export function CollapsibleSection({ item, isExpanded }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (!item.items) return null

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-between font-semibold",
          isOpen && "bg-accent/50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          {isExpanded && <span>{item.label}</span>}
        </div>
        {isExpanded && (
          <div className="text-muted-foreground">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </Button>
      {isOpen && isExpanded && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-2">
          {item.items.map((subItem) => (
            <Link key={subItem.href} href={subItem.href || "#"}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === subItem.href && "bg-accent/50"
                )}
              >
                {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                <span>{subItem.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 