'use client';

import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '../theme-toggle';
import { scrollToSection } from "@/lib/utils/scroll"
import { useRouter } from 'next/navigation';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (href?.startsWith("#")) {
      scrollToSection(href.substring(1))
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: "#8ec2b3" }}>
              Aurai Wind
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={handleNavClick}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={handleNavClick}
            >
              How It Works
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={handleNavClick}
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {status === 'loading' ? (
              <div>Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">{session.user?.name}</span>
                <Button 
                  onClick={() => signOut()} 
                  variant="outline" 
                  size="sm"
                  style={{ borderColor: "#8ec2b3", color: "#8ec2b3" }}
                >
                  Sign Out
                </Button>
                <Link href="/dashboard">
                  <Button 
                    size="sm"
                    style={{ backgroundColor: "#8ec2b3" }}
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Button 
                onClick={() => router.push('/sign-in')}
                size="sm"
                style={{ backgroundColor: "#8ec2b3" }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
} 