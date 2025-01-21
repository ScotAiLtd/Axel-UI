"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ContainerElement = HTMLDivElement | HTMLElement

interface ContainerProps extends React.HTMLAttributes<ContainerElement> {
  as?: 'div' | 'section' | 'main' | 'article' | 'aside' | 'header' | 'footer' | 'nav'
}

export function Container({
  className,
  as: Component = 'div',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
} 