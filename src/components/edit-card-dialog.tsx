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
import { Button } from "@/components/ui/button";
import { updateCard } from "@/app/actions/cards";
import { useRouter } from "next/navigation";

// Zod schema matching the server action
const formSchema = z.object({
  front: z.string().min(1, "Front text is required").max(5000, "Front text is too long"),
  back: z.string().min(1, "Back text is required").max(5000, "Back text is too long"),
});

type FormValues = z.infer<typeof formSchema>;

type EditCardDialogProps = {
  cardId: number;
  deckId: number;
  currentFront: string;
  currentBack: string;
  trigger?: React.ReactNode;
};

export function EditCardDialog({ cardId, deckId, currentFront, currentBack, trigger }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: currentFront,
      back: currentBack,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await updateCard({
        cardId,
        deckId,
        front: values.front,
        back: values.back,
      });
      
      // Close dialog
      setOpen(false);
      
      // Refresh the page to show the updated card
      router.refresh();
    } catch (error) {
      console.error("Error updating card:", error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Card</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Update the card's front and back content.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Front</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter the question or prompt..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Back</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter the answer or explanation..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
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
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}






