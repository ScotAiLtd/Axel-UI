import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="pt-24 pb-16">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex flex-col items-center text-center lg:text-left lg:items-start space-y-8 flex-1">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to Your Next.js Website
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A modern, responsive website built with Next.js and Tailwind CSS.
              Perfect for showcasing your products or services.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[#8ec2b3]/20">
                <Image
                  src="/windmill2.webp"
                  alt="Wind Turbine"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
} 