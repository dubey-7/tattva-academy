"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { isTeacherRole } from "@/lib/academy";

import type { Profile } from "@/types/academy";

interface Loaded {
  uid: string;
  profile: Profile | null;
}

/**
 * Current auth user + their `profiles` row.
 * If the row is missing (e.g. registered before the signup trigger existed)
 * it is created from the metadata saved at signup.
 */
export function useAcademyUser() {
  const { user, loading: authLoading } = useAuth();

  const [supabase] = useState(() => createClient());
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [tick, setTick] = useState(0);

  const uid = user?.id;

  useEffect(() => {
    if (!uid || !user) return;

    let cancelled = false;

    (async () => {
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      let profile = (existing as Profile | null) ?? null;

      if (!profile) {
        const meta = user.user_metadata ?? {};

        const { data: created } = await supabase
          .from("profiles")
          .insert({
            id: uid,
            full_name:
              meta.full_name || user.email?.split("@")[0] || "Student",
            phone: meta.phone || null,
            grade: meta.grade || null,
            country: meta.country || null,
            role: "student",
          })
          .select("*")
          .maybeSingle();

        profile = (created as Profile | null) ?? null;
      }

      if (!cancelled) setLoaded({ uid, profile });
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, uid, user, tick]);

  const profileLoading = !!uid && loaded?.uid !== uid;
  const profile = loaded && loaded.uid === uid ? loaded.profile : null;

  return {
    user,
    profile,
    loading: authLoading || profileLoading,
    isTeacher: isTeacherRole(profile?.role),
    refreshProfile: () => setTick((t) => t + 1),
  };
}
