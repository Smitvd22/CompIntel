import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/salaries">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Explore Salaries
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
