"use client"

import { Container } from "@/components/ui/Container"
import { HoverCard } from "@/components/ui/HoverCard"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { useParallax } from "@/hooks/useParallax"
import { motion } from "framer-motion"
import { 
  Brain, 
  Shield, 
  Zap, 
  FileSearch, 
  BarChart, 
  Clock,
  LucideIcon
} from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze your documentation for compliance and completeness.",
    icon: Brain
  },
  {
    title: "Automated Compliance",
    description: "Ensure adherence to industry standards and regulations automatically.",
    icon: Shield
  },
  {
    title: "Real-time Processing",
    description: "Process and analyze documents in real-time for immediate insights.",
    icon: Zap
  },
  {
    title: "Smart Search",
    description: "Quickly find any document with our intelligent search system.",
    icon: FileSearch
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive analytics to track and improve documentation processes.",
    icon: BarChart
  },
  {
    title: "Time Savings",
    description: "Reduce documentation processing time by up to 70%.",
    icon: Clock
  }
]

export function FeaturesSection() {
  const { ref, y } = useParallax()

  return (
    <section id="features">
      <Container className="py-24">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage wind turbine documentation effectively
          </p>
        </AnimatedSection>

        <motion.div 
          ref={ref}
          style={{ y }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <HoverCard>
                <feature.icon className="w-10 h-10 mb-4" style={{ color: "#8ec2b3" }} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </HoverCard>
            </AnimatedSection>
          ))}
        </motion.div>
      </Container>
    </section>
  )
} 