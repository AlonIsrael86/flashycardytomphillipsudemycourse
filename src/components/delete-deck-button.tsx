"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDeck } from "@/app/actions/decks";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteDeckButtonProps = {
  deckId: number;
  deckName: string;
};

export function DeleteDeckButton({ deckId, deckName }: DeleteDeckButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteDeck({ id: deckId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting deck:", error);
      // You could add toast notification here
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          data-testid="delete-deck-button"
          data-deck-id={deckId}
          variant="ghost"
          className="bg-zinc-800 hover:bg-zinc-700 text-red-400 hover:text-red-300 border border-zinc-700"
          title="Delete deck"
        >
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-white">Delete Deck</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to delete "{deckName}"? This will also delete all cards in this deck. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            data-testid="confirm-delete-deck"
            className="bg-red-600 hover:bg-red-700 text-white border-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Deck"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}






