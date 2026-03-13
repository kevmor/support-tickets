"use client";

import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adjustTicketPriority, updateTicketCategories } from "@/app/actions";
import { Category, Ticket } from "@/app/lib/definitions";
import { toast } from "sonner";
import {
  FilePenLine,
  SettingsIcon,
  TrendingUpIcon,
  TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const PRIORITY_DELTAS = [10, 30, 50] as const;

export default function EditTicketDropDownMenu({
  ticket,
  categories,
}: {
  ticket: Ticket;
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    ticket.categories?.map((category) => category.id) ?? [],
  );
  const [priority, setPriority] = useState(ticket.priority);

  function handleCategoryToggle(categoryId: number, checked: boolean) {
    const nextCategoryIds = checked
      ? [...selectedCategoryIds, categoryId]
      : selectedCategoryIds.filter((currentCategoryId) => {
          return currentCategoryId !== categoryId;
        });

    startTransition(async () => {
      const result = await updateTicketCategories(ticket.id, nextCategoryIds);
      if (!result.success) {
        toast.error("Failed to update categories", {
          description: result.error,
        });
        return;
      }

      setSelectedCategoryIds(nextCategoryIds);
      router.refresh();
    });
  }

  function handlePriorityChange(delta: number) {
    startTransition(async () => {
      const result = await adjustTicketPriority(ticket.id, delta);
      if (!result.success || typeof result.priority !== "number") {
        toast.error("Failed to update priority", {
          description: result.error,
        });
        return;
      }

      setPriority(result.priority);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`Edit ticket ${ticket.id}`}
            className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <FilePenLine size={16} strokeWidth={1.8} />
          </button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <TagIcon />
            Category
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {selectedCategoryIds.length === 0
                    ? "No categories selected"
                    : `${selectedCategoryIds.length} categor${selectedCategoryIds.length === 1 ? "y" : "ies"} selected`}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategoryIds.includes(category.id)}
                    disabled={isPending}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(category.id, checked)
                    }
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <TrendingUpIcon />
            Priority
            <DropdownMenuShortcut>{priority}</DropdownMenuShortcut>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  Current priority: {priority}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {PRIORITY_DELTAS.map((delta) => (
                  <DropdownMenuItem
                    key={`increase-${delta}`}
                    disabled={isPending}
                    onClick={() => handlePriorityChange(delta)}
                  >
                    <SettingsIcon />+{delta}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {PRIORITY_DELTAS.map((delta) => (
                  <DropdownMenuItem
                    key={`decrease-${delta}`}
                    disabled={isPending}
                    onClick={() => handlePriorityChange(-delta)}
                  >
                    <SettingsIcon />-{delta}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
