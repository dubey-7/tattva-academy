"use client";

import { ReactNode, useState } from "react";
import { Loader2, LogIn } from "lucide-react";

import AuthDialog from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ---------- Page wrapper ---------- */

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[70vh] bg-muted/30 pb-20">
      <div className="border-b bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

/* ---------- Loading / login states ---------- */

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}

export function LoginRequired({ message }: { message: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LogIn className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-bold">Please log in</h2>

        <p className="mt-2 text-muted-foreground">{message}</p>

        <Button
          className="mt-6 h-11 w-full rounded-xl"
          onClick={() => setOpen(true)}
        >
          Login / Register
        </Button>
      </div>

      <AuthDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

/* ---------- Small building blocks ---------- */

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border bg-card p-5 shadow-sm sm:p-6",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-bold sm:text-xl">{title}</h2>}

            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      {children}
    </section>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>

      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const badgeStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  present: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  completed: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  scheduled: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  partial: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  unpaid: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-300",
  absent: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const value = status || "—";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        badgeStyles[value] ?? "bg-muted text-muted-foreground"
      )}
    >
      {value}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <p className="font-semibold">{title}</p>

      {text && (
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {text}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------- Form controls ---------- */

export const controlClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return <select className={cn(controlClass, className)} {...props} />;
}
