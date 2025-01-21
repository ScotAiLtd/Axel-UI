"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SidebarItem } from "@/types/sidebar"

interface CollapsibleSectionProps {
  item: SidebarItem;
  isExpanded: boolean;
  pathname: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  item,
  isExpanded,
  pathname
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between py-2 px-3 rounded-md hover:bg-accent",
          pathname.startsWith(item.href || '') && "bg-accent"
        )}
      >
        <div className="flex items-center">
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {isExpanded && <span>{item.label}</span>}
        </div>
        {isExpanded && (
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          />
        )}
      </button>
      {isOpen && isExpanded && item.items && (
        <div className="ml-4 mt-2 space-y-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href || ''}
              className={cn(
                "block py-2 px-3 rounded-md hover:bg-accent",
                pathname === subItem.href && "bg-accent"
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 