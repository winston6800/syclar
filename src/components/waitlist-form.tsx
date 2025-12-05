"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import * as motion from "motion/react-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    form.clearErrors(); // clear errors

    const validationResult = formSchema.safeParse(data);

    if (!validationResult.success) {
      validationResult.error.errors.forEach((error) => {
        form.setError(error.path[0] as keyof FormValues, {
          type: "manual",
          message: error.message,
        });
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      let responseBody = {};
      try {
        // 204
        const text = await response.text();
        if (text) {
          responseBody = JSON.parse(text);
        }
      } catch (parseError) {
        console.error("Failed to parse response body:", parseError);
        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status}: ${
              response.statusText || "Request failed"
            }`
          );
        }
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error("This email is already registered for the waitlist!");
        }
        throw new Error(
          (responseBody as { message?: string })?.message ||
            `Request failed with status: ${response.status}`
        );
      }

      toast.success(
        (responseBody as { message?: string })?.message ||
          "Successfully joined the waitlist!"
      );
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  autoComplete="email"
                  className="h-14 rounded-full border-neutral-300 bg-white/80 px-6 text-base backdrop-blur-xl transition-all focus:border-neutral-400 focus:bg-white focus:shadow-lg dark:border-neutral-700 dark:bg-neutral-900/80 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
                  aria-label="Email address for waitlist"
                  aria-invalid={!!form.formState.errors.email}
                  {...field}
                />
              </FormControl>
              <FormMessage className="absolute left-0 right-0 top-full pt-2 text-xs text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 shrink-0 rounded-full bg-neutral-900 px-8 text-base font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          aria-live="polite"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </motion.form>
    </Form>
  );
}
