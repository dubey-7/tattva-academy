"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Star, X } from "lucide-react";

import {
  EmptyState,
  NativeSelect,
  Panel,
  StatusBadge,
} from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import type { Review } from "@/types/review";

export default function ReviewsTab() {
  const [supabase] = useState(() => createClient());
  const [rows, setRows] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState("pending");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cancelled) setRows((data ?? []) as Review[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, tick]);

  async function update(id: number, patch: Record<string, unknown>) {
    const { error } = await supabase
      .from("reviews")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    setTick((t) => t + 1);
  }

  const list = (rows ?? []).filter(
    (r) => filter === "all" || r.status === filter
  );

  return (
    <Panel
      title="Review moderation"
      description="Approved reviews appear on the website. Featured ones show on the home page."
      action={
        <NativeSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 w-auto"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </NativeSelect>
      }
    >
      {rows === null ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : list.length ? (
        <ul className="divide-y">
          {list.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{r.name}</p>

                    <span className="flex items-center text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>

                    <StatusBadge status={r.status} />

                    {r.is_featured && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {r.review}
                  </p>

                  {r.country && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.country}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.status !== "approved" && (
                    <Button
                      size="sm"
                      className="h-9 rounded-lg"
                      onClick={() =>
                        update(r.id, {
                          status: "approved",
                          approved_at: new Date().toISOString(),
                        })
                      }
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      Approve
                    </Button>
                  )}

                  {r.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-lg"
                      onClick={() =>
                        update(r.id, { status: "rejected", is_featured: false })
                      }
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      Reject
                    </Button>
                  )}

                  {r.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-lg"
                      onClick={() =>
                        update(r.id, { is_featured: !r.is_featured })
                      }
                    >
                      <Star className="mr-1.5 h-4 w-4" />
                      {r.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nothing here" />
      )}
    </Panel>
  );
}
