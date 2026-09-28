import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/profiles";

const tabs = [
  { href: "/admin/students", label: "Students" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/lectures", label: "Lectures" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getProfileById(user.id);

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl font-bold">Admin Panel</h1>

      <div className="mt-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
