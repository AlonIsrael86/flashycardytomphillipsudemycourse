"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAICards } from "@/app/actions/cards";
import { getDeckMetadataIssue } from "@/lib/deck-validation";

type GenerateAICardsButtonProps = {
  deckId: number;
  hasAIGeneration: boolean;
  deckName: string;
  deckDescription?: string | null;
};

export function GenerateAICardsButton({
  deckId,
  hasAIGeneration,
  deckName,
  deckDescription,
}: GenerateAICardsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardCount, setCardCount] = useState<number>(4);
  const router = useRouter();

  // Check if metadata is valid
  const metadataIssue = getDeckMetadataIssue(deckName, deckDescription);
  const isMetadataValid = !metadataIssue;

  async function handleClick() {
    if (!hasAIGeneration) {
      router.push("/pricing");
      return;
    }

    // This should not be reachable if button is disabled, but double-check
    if (!isMetadataValid) {
      return;
    }

    setIsGenerating(true);
    try {
      await generateAICards({ deckId, cardCount });
      router.refresh();
    } catch (error) {
      console.error("Error generating AI cards:", error);
      alert(error instanceof Error ? error.message : "Failed to generate AI cards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const button = (
    <Button
      onClick={handleClick}
      disabled={isGenerating || (hasAIGeneration && !isMetadataValid)}
      className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
    >
      {isGenerating ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating...
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate cards with AI
        </>
      )}
    </Button>
  );

  // Free user / no feature: show paid feature tooltip
  if (!hasAIGeneration) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a paid feature. Click to view pricing options.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Pro user with invalid metadata: disable button and show tooltip using disabled-button wrapper pattern
  if (!isMetadataValid) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              {button}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{metadataIssue} Use the Edit button to update deck details.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Pro user with valid metadata: enable button and show card count picker
  return (
    <div className="flex items-center gap-2">
      <Select
        value={cardCount.toString()}
        onValueChange={(value: string) => setCardCount(Number(value))}
        disabled={isGenerating}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 card</SelectItem>
          <SelectItem value="2">2 cards</SelectItem>
          <SelectItem value="3">3 cards</SelectItem>
          <SelectItem value="4">4 cards</SelectItem>
        </SelectContent>
      </Select>
      {button}
    </div>
  );
}

