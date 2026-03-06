"use client";

import { SyntheticEvent } from "react";

export default function TicketForm() {
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // you can access fields via e.currentTarget.elements if needed
    console.log("submitting", e.currentTarget.elements);
    alert("Ticket submitted! A support agent will contact you shortly.");
  };

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
              <input
                type="text"
                id="title"
                name="title"
                maxLength={100}
                placeholder="Brief summary for ticket title..."
                className="bg-gray-100 mt-1 p-3 text-base block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Please describe the issue..."
                maxLength={500}
                className="bg-gray-100 mt-1 p-3 text-base block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              ></textarea>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Max 500 characters
              </p>
            </div>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 bg-blue-700 px-3 py-1.5 text-base 
              text-zinc-100 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-400 
              hover:text-zinc-50 dark:border-blue-500 dark:bg-blue-950 dark:text-zinc-300 
              dark:hover:border-blue-700 dark:hover:bg-blue-800 dark:hover:text-zinc-100 
              "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
