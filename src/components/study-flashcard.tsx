"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Flashcard = {
  id: number;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
};

type StudyFlashcardProps = {
  cards: Flashcard[];
  deckName: string;
};

export function StudyFlashcard({ cards, deckName }: StudyFlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Initialize with cards immediately to prevent hydration mismatch
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>(cards);
  const [isShuffled, setIsShuffled] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));

  // Initialize cards when cards prop changes
  useEffect(() => {
    if (!isShuffled) {
      // Start with original order
      setShuffledCards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setViewedCards(new Set([0])); // Mark first card as viewed
    }
    // If shuffled, keep the shuffled order even if cards prop changes
  }, [cards, isShuffled]);

  // Track viewed cards when navigating
  useEffect(() => {
    if (shuffledCards.length > 0) {
      setViewedCards((prev) => new Set([...prev, currentIndex]));
    }
  }, [currentIndex, shuffledCards.length]);

  const currentCard = shuffledCards[currentIndex];
  const totalCards = shuffledCards.length;
  const progress = totalCards > 0 ? (viewedCards.size / totalCards) * 100 : 0;

  // Define handlers before using them in useEffect
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setIsFlipped(false);
      setViewedCards((prev) => new Set([...prev, nextIndex]));
    }
  }, [currentIndex, totalCards]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setIsFlipped(false);
      setViewedCards((prev) => new Set([...prev, prevIndex]));
    }
  }, [currentIndex]);

  // Keyboard event handlers - must be after handler definitions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      switch (event.key) {
        case " ": // Spacebar - flip card
          event.preventDefault();
          handleFlip();
          break;
        case "ArrowLeft": // Left arrow - previous card
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight": // Right arrow - next card
          event.preventDefault();
          handleNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFlip, handlePrevious, handleNext]);

  const handleShuffle = () => {
    const newShuffled = [...cards];
    // Fisher-Yates shuffle algorithm
    for (let i = newShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
    }
    setShuffledCards(newShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
    setViewedCards(new Set([0])); // Reset progress, mark first card as viewed
  };

  const handleReset = () => {
    setShuffledCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(false);
    setViewedCards(new Set([0])); // Reset progress, mark first card as viewed
  };

  // Don't render if no cards available
  if (!currentCard || shuffledCards.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center text-zinc-400 py-12">
          No cards available to study.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-zinc-400">Progress</span>
          <span className="text-zinc-400">
            {viewedCards.size} of {totalCards} cards viewed
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-zinc-800 [&>div]:bg-zinc-600"
        />
      </div>

      {/* Progress and Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={isShuffled ? handleReset : handleShuffle}
            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white"
          >
            {isShuffled ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Order
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Shuffle
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <Card
          data-testid="study-flashcard"
          className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 cursor-pointer transition-all duration-300 hover:border-zinc-700 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center"
          onClick={handleFlip}
        >
          <CardContent className="p-4 sm:p-6 md:p-8 w-full h-full flex items-center justify-center">
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front Side */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
              >
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                  Front
                </div>
                <p className="text-lg sm:text-xl md:text-2xl text-center text-white leading-relaxed whitespace-pre-wrap px-2">
                  {currentCard.front}
                </p>
                <div className="mt-8 text-xs text-zinc-500">
                  Click or press Space to flip
                </div>
              </div>

              {/* Back Side */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                  Back
                </div>
                <p className="text-lg sm:text-xl md:text-2xl text-center text-white leading-relaxed whitespace-pre-wrap px-2">
                  {currentCard.back}
                </p>
                <div className="mt-8 text-xs text-zinc-500">
                  Click or press Space to flip
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <Button
            data-testid="study-previous-button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </Button>

        <Button
          data-testid="study-flip-button"
          variant="outline"
          onClick={handleFlip}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white w-full sm:w-auto"
        >
          {isFlipped ? (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Show Front
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Show Answer
            </>
          )}
        </Button>

        <Button
          data-testid="study-next-button"
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Next
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
        </div>
        <div className="text-center text-xs text-zinc-500 px-2">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">Space</kbd>
            <span>to flip</span>
          </span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">←</kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">→</kbd>
            <span>to navigate</span>
          </span>
        </div>
      </div>
    </div>
  );
}

