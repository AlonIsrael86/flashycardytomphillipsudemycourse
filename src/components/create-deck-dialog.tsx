"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDeck } from "@/app/actions/decks";
import { useRouter } from "next/navigation";

// Zod schema matching the server action
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateDeckDialogProps = {
  trigger?: React.ReactNode;
};

export function CreateDeckDialog({ trigger }: CreateDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      await createDeck({
        name: values.name,
        description: values.description || undefined,
      });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
      
      // Refresh the page to show the new deck
      router.refresh();
    } catch (error) {
      console.error("Error creating deck:", error);
      // Display error message to user
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create deck. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
            Create Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Deck</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new flashcard deck with a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="deck-name-input"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                      placeholder="Enter deck name..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      data-testid="deck-description-input"
                      value={field.value || ""}
                      className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter deck description (optional)..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {error && (
              <div className="rounded-md bg-red-900/20 border border-red-800 p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="create-deck-submit"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Deck"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}





