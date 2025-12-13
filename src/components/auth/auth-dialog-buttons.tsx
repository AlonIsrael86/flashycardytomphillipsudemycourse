"use client";

import { useState } from "react";
import { SignIn, SignUp, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AuthDialogButtons() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <SignedOut>
      {/* Sign Up Dialog */}
      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogTrigger asChild>
          <Button
            data-testid="auth-signup-trigger"
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 text-lg px-8 py-6 rounded-xl"
          >
            <span>Get Started Free</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Create your account</DialogTitle>
            <DialogDescription>Create an account to start building decks.</DialogDescription>
          </DialogHeader>
          <SignUp 
            forceRedirectUrl="/dashboard"
            signInForceRedirectUrl="/dashboard"
          />
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogTrigger asChild>
          <Button
            data-testid="auth-signin-trigger"
            variant="outline"
            size="lg"
            className="bg-zinc-800/50 hover:bg-zinc-700 text-white border-zinc-600 hover:border-zinc-500 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl"
          >
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Sign in to continue.</DialogDescription>
          </DialogHeader>
          <SignIn 
            forceRedirectUrl="/dashboard"
          />
        </DialogContent>
      </Dialog>
    </SignedOut>
  );
}

