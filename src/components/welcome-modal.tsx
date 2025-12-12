"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "flashycardy-welcome-shown";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let hasShown = false;
    try {
      if (typeof window !== "undefined") {
        hasShown = localStorage.getItem(STORAGE_KEY) === "true";
      }
    } catch (error) {
      // Silently fail
    }

    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
      }
    } catch (error) {
      // Silently fail
    }
  };

  const handleContactClick = () => {
    window.open("https://justintime.co.il", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        dir="rtl"
        className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-700/50 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0"
      >
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          
          <DialogHeader className="relative p-6 pb-4 text-right border-b border-zinc-800/50">
            {/* Logo Badge */}
            <div className="flex justify-end mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-bold bg-gradient-to-l from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ברוכים הבאים ל-FlashyCardy
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-lg pt-2">
              הדגמה של יכולות פיתוח עם AI - מבית{" "}
              <span className="text-purple-400 font-semibold">JustInTime</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-right">
          <p className="text-zinc-300 text-base leading-relaxed">
            אתר זה מדגים מה אפשר לבנות בעזרת כלי פיתוח מבוססי בינה מלאכותית.
          </p>

          {/* Features Grid */}
          <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
            <div className="text-white font-semibold mb-4 flex items-center justify-end gap-2">
              <span>מה ההדגמה הזו כוללת</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
            </div>
            <div className="grid gap-3">
              {[
                { icon: "🔐", text: "הרשמה והתחברות משתמשים", tech: "Clerk" },
                { icon: "💳", text: "תשלומים ומנויים", tech: "Stripe" },
                { icon: "🤖", text: "יצירת תוכן עם AI", tech: "OpenAI" },
                { icon: "✨", text: "ממשק מודרני ורספונסיבי", tech: "Next.js + shadcn/ui" },
                { icon: "⚡", text: "פיתוח Full-Stack", tech: "Cursor AI" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-end gap-3 text-zinc-300 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30 hover:border-zinc-600/50 transition-colors"
                >
                  <div className="flex-1 text-right">
                    <span>{item.text}</span>
                    <span className="text-purple-400 text-sm mr-2">({item.tech})</span>
                  </div>
                  <span className="text-xl">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-zinc-400 text-sm leading-relaxed border-r-2 border-purple-500/50 pr-4">
            זהו פרויקט הדגמה בלבד. כדי לשמור על פרטיות הלקוחות שלנו, אנחנו לא
            מציגים את האתרים האמיתיים שלהם. אפליקציית הכרטיסיות הזו משמשת כהוכחת יכולת.
          </p>

          {/* Demo Payments Card */}
          <div className="relative bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-zinc-700/50 overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative flex items-start justify-end gap-3">
              <div className="text-right">
                <p className="text-white font-semibold mb-1 flex items-center justify-end gap-2">
                  <span>תשלומי דמו</span>
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </p>
                <p className="text-zinc-400 text-sm">
                  ניתן לבדוק את תהליך השדרוג באמצעות פרטי כרטיס האשראי לדוגמה המופיעים בעמוד התשלום.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Question */}
          <p className="text-white text-lg font-medium pt-2 text-center">
            מעוניינים לבנות משהו דומה לעסק שלכם? 🚀
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-3 sm:justify-center">
          <Button
            onClick={handleContactClick}
            className="bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 text-base py-5"
          >
            <span>צור קשר עם JustInTime</span>
            <svg className="w-4 h-4 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="bg-zinc-800/50 hover:bg-zinc-700 text-white border-zinc-600 hover:border-zinc-500 transition-all duration-300 text-base py-5"
          >
            לחקור את ההדגמה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
