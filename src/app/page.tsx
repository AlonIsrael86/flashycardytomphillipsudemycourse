import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-zinc-800">
        <Link href="/" className="text-2xl font-bold">
          Flashy Cardy Course
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Flashy Cardy Course
            </span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-12">
            An interactive flashcard learning system designed to help you master
            new concepts through spaced repetition and engaging practice.
          </p>

          <Card className="w-full max-w-md mx-auto bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription className="text-zinc-400">
                Join thousands of learners and start your journey to mastery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignedOut>
                <div className="flex flex-col gap-3">
                  <SignUpButton mode="modal">
                    <Button className="w-full" size="lg">
                      Start Learning
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">
                      Already have an account? Sign In
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </SignedIn>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
