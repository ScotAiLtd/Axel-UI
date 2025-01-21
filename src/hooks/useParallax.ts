import { useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef } from "react"

interface ParallaxProps {
  offset?: number
  direction?: "up" | "down"
}

export function useParallax({ offset = 50, direction = "up" }: ParallaxProps = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [offset, -offset] : [-offset, offset]
  )

  return { ref, y }
} 