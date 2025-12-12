'use client';

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-white hover:text-zinc-300 transition-colors">
          FlashyCardy
        </Link>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </header>
  );
}

