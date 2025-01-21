"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { PanelLeft, PanelRightClose } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CollapsibleSection } from "./CollapsibleSection"
import { sidebarConfig } from "@/config/sidebar"
import { SidebarItem } from "@/types/sidebar"
import { Badge } from "@/components/ui/badge"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CollapsibleSectionProps {
  item: SidebarItem;
  isExpanded: boolean;
  pathname: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await signOut({ 
      redirect: true,
      callbackUrl: '/' 
    })
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col border-r transition-all duration-300",
        "bg-[#8ec2b3]/5 dark:bg-[#8ec2b3]/10",
        isExpanded ? "w-64" : "w-[70px]",
        className
      )}
    >
      <div className="flex h-14 items-center border-b dark:border-[#8ec2b3]/20 px-3 py-2">
        <div className="flex items-center gap-2">
          {isExpanded && (
            <span className="text-xl font-semibold">
              Aurai Wind
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelRightClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
        {sidebarConfig.map((section, index) => (
          <div key={index} className="space-y-2">
            {isExpanded && (
              <h2 className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.isCollapsible ? (
                    <CollapsibleSection 
                      item={item} 
                      isExpanded={isExpanded}
                      pathname={pathname}
                    />
                  ) : item.href === "/auth/signout" ? (
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "text-muted-foreground",
                        !isExpanded && "justify-center"
                      )}
                    >
                      {item.icon && (
                        <item.icon className={cn("h-4 w-4", !isExpanded && "h-5 w-5")} />
                      )}
                      {isExpanded && <span>{item.label}</span>}
                    </button>
                  ) : (
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                        item.isDisabled 
                          ? "opacity-60 cursor-not-allowed" 
                          : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                        !isExpanded && "justify-center"
                      )}
                    >
                      {item.href ? (
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          {item.icon && (
                            <item.icon className={cn("h-4 w-4", !isExpanded && "h-5 w-5")} />
                          )}
                          {isExpanded && (
                            <div className="flex items-center justify-between w-full">
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </Link>
                      ) : (
                        <>
                          {item.icon && (
                            <item.icon className={cn("h-4 w-4", !isExpanded && "h-5 w-5")} />
                          )}
                          {isExpanded && (
                            <div className="flex items-center justify-between w-full">
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
} 