import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold">Flashy Cardy Course</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <SignedIn>
          <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-3xl">Welcome to your Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-lg">
                This is your personal dashboard. Your flashcard content and progress
                will appear here.
              </p>
            </CardContent>
          </Card>
        </SignedIn>
        <SignedOut>
          <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-3xl">Please Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-lg mb-4">
                You need to be signed in to access your dashboard.
              </p>
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Sign In to Continue
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </SignedOut>
      </main>
    </div>
  );
}

