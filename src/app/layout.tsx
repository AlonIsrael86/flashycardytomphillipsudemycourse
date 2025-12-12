import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Header } from "@/components/header";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "FlashyCardy | Your Personal Flashcard Platform",
    template: "%s | FlashyCardy",
  },
  description: "Create, manage, and study with your personal flashcard platform. Organize your learning with customizable decks and cards.",
  keywords: ["flashcards", "study", "learning", "education", "memorization", "quiz"],
  openGraph: {
    title: "FlashyCardy | Your Personal Flashcard Platform",
    description: "Create, manage, and study with your personal flashcard platform. Organize your learning with customizable decks and cards.",
    type: "website",
    siteName: "FlashyCardy",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashyCardy | Your Personal Flashcard Platform",
    description: "Create, manage, and study with your personal flashcard platform.",
  },
};

const clerkAppearance = {
  baseTheme: dark,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${poppins.className} dark`}>
        <body className="antialiased">
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
