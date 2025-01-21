import { Container } from "@/components/ui/Container"
import { 
  Upload, 
  Cpu, 
  ClipboardCheck, 
  FileOutput 
} from "lucide-react"

const steps = [
  {
    title: "Upload Documents",
    description: "Upload your technical documentation, drawings, and specifications",
    icon: Upload,
  },
  {
    title: "AI Analysis",
    description: "Our AI system analyzes and processes your documentation",
    icon: Cpu,
  },
  {
    title: "Expert Review",
    description: "Automated validation against industry standards and best practices",
    icon: ClipboardCheck,
  },
  {
    title: "Generate Output",
    description: "Receive comprehensive, compliant documentation ready for use",
    icon: FileOutput,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works">
      <Container className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our streamlined process makes document management simple and efficient
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center p-6"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#8ec2b3" }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[-48px] left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-muted" />
                )}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 