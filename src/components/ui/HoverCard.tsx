"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverCardProps extends Omit<HTMLMotionProps<"div">, "whileHover" | "whileTap" | "transition"> {
  children: React.ReactNode
}

export function HoverCard({ 
  children, 
  className, 
  ...props 
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "rounded-xl bg-card p-6 shadow-sm transition-colors hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
} 