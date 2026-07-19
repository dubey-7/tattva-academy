"use client";

import { MailCheck, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  email: string;
  onLogin: () => void;
  onResend: () => void;
  title?: string;
  description?: string;
}

export default function RegistrationSuccess({
  email,
  onLogin,
  onResend,
  title = "Registration Successful",
  description = "We've sent a verification email to",
}: Props) {
  function openMail() {
    const domain = email.split("@")[1] ?? "";

    if (domain.includes("gmail")) {
      window.open(
        "https://mail.google.com",
        "_blank"
      );
      return;
    }

    if (domain.includes("outlook")) {
      window.open(
        "https://outlook.live.com/mail/",
        "_blank"
      );
      return;
    }

    if (domain.includes("yahoo")) {
      window.open(
        "https://mail.yahoo.com",
        "_blank"
      );
      return;
    }

    window.open("https://mail.google.com", "_blank");
  }

  return (
    <Card className="border-0 shadow-none">
      <div className="space-y-6 py-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <MailCheck className="h-10 w-10 text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <p className="mt-3 text-muted-foreground">
            {description}
          </p>

          <p className="mt-2 font-semibold">
            {email}
          </p>

          <p className="mt-5 text-sm text-muted-foreground">
            Please verify your email before logging in.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={openMail}
          >
            Open Mail
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={onResend}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Resend Verification Email
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onLogin}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </Card>
  );
}