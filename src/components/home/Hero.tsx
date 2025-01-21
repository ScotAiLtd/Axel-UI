import { Container } from '../ui/Container';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section className="pt-24 pb-16">
      <Container>
        <div className="flex flex-col items-center text-center space-y-8">
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
      </Container>
    </section>
  );
} 