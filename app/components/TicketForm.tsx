"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTicket } from "../actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export default function TicketForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(50);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await saveTicket(new FormData(e.currentTarget));
    setSubmitting(false);

    if (!res.success) {
      toast.error("Failed to submit ticket", { description: res.error });
      return;
    }

    toast.success("Ticket submitted!", {
      description: "Your help request has been submitted.",
      position: "top-center",
    });
    router.push("/");
  };

  function getPriorityLabel(value: number) {
    if (value <= 10) return "Eventually, sometime";
    if (value <= 30) return "Low priority";
    if (value <= 60) return "Medium priority";
    if (value <= 70) return "High priority";
    if (value <= 90) return "Urgent priority";
    return "Extremely urgent";
  }

  return (
    <div>
      <div className="m-5 p-5 grid grid-cols-2 gap-5 rounded-sm">
        <div>
          {/* Left column */}
          <h2 className="text-xl mb-1">New Help Request</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Please provide details about your help request.
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4">
            Submitting a ticket will notify the support team via email and they
            will get back to you as soon as possible.
          </p>
        </div>
        <div>
          {/* Right column */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                maxLength={100}
                placeholder="Brief summary for ticket title..."
                required
              />
            </div>
            <div>
              <Field>
                <label
                  htmlFor="description"
                  className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Description
                </label>
                <Textarea
                  placeholder="Please describe the issue. Feel free to paste any error messages."
                  id="description"
                  name="description"
                  value={description}
                  maxLength={500}
                  aria-label="Description"
                  className="mb-1 h-32"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {description.length === 0 && "Max 500 characters"}
                {description.length > 0 &&
                  description.length < 500 &&
                  `${description.length}/500 characters`}
                {description.length === 500 && "Character limit reached"}
              </span>
            </div>
            <span>How urgent is your request?</span>

            <input type="hidden" name="priority" value={priority} />
            <Slider
              value={priority}
              max={100}
              step={1}
              onValueChange={(value) =>
                setPriority(Array.isArray(value) ? value[0] : value)
              }
            />
            <span>
              {priority} - {getPriorityLabel(priority)}
            </span>

            <Separator />
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-md border border-zinc-300 bg-blue-700 px-3 py-1.5 text-base 
              text-zinc-100 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-400 
              hover:text-zinc-50 dark:border-blue-500 dark:bg-blue-950 dark:text-zinc-300 
              dark:hover:border-blue-700 dark:hover:bg-blue-800 dark:hover:text-zinc-100
              disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
