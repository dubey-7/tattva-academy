"use client";

import { useEffect, useRef, useState } from "react";

/** Simple seconds-remaining countdown, used for OTP resend cooldowns. */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function start(from: number) {
    setSeconds(from);

    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timer.current) clearInterval(timer.current);
          return 0;
        }

        return s - 1;
      });
    }, 1000);
  }

  return { seconds, start };
}
