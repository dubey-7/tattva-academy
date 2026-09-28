"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

import { EmptyState, Panel, controlClass } from "../DashboardUI";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import type { TrialRegistration } from "@/types/trial";

export default function TrialsTab() {
  const [supabase] = useState(() => createClient());
  const [rows, setRows] = useState<TrialRegistration[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("trial_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cancelled) setRows((data ?? []) as TrialRegistration[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!rows) return [];
    if (!q) return rows;

    return rows.filter((r) =>
      [r.student_name, r.parent_name, r.email, r.country, r.subject, r.curriculum]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  return (
    <Panel
      title="Free trial requests"
      description="Families who booked a demo class from the website."
      action={
        <input
          className={`${controlClass} h-9 w-56`}
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
    >
      {rows === null ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length ? (
        <ul className="divide-y">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">
                  {r.student_name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · Grade {r.grade}
                  </span>
                </p>

                <p className="text-sm text-muted-foreground">
                  {r.subject} · {r.curriculum} · {r.country}
                </p>

                <p className="text-xs text-muted-foreground">
                  Parent: {r.parent_name} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="h-9 rounded-lg">
                  <a
                    href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>

                <Button asChild size="sm" variant="outline" className="h-9 rounded-lg">
                  <a href={`mailto:${r.email}`}>
                    <Mail className="mr-1.5 h-4 w-4" />
                    Email
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No trial requests found" />
      )}
    </Panel>
  );
}
