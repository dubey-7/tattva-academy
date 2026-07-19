"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import RegistrationSuccess from "./RegistrationSuccess";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({
  open,
  onOpenChange,
}: Props) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [registeredEmail, setRegisteredEmail] =
    useState("");

  const [successTitle, setSuccessTitle] =
    useState("Registration Successful");

  const [successDescription, setSuccessDescription] =
    useState(
      "We've sent a verification email to"
    );

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [register, setRegister] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    grade: "",
    country: "",
  });

  /* ---------------- REGISTER ---------------- */

  async function registerUser() {
    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: register.email,
        password: register.password,
        options: {
          data: {
            full_name: register.full_name,
          },
        },
      });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: register.full_name,
        phone: register.phone,
        grade: register.grade,
        country: register.country,
      });

      setRegisteredEmail(register.email);

      setSuccessTitle(
        "Registration Successful"
      );

      setSuccessDescription(
        "We've sent a verification email to"
      );

      setShowSuccess(true);

      toast.success(
        "Verification email sent successfully."
      );
    }

    setLoading(false);
  }

  /* ---------------- LOGIN ---------------- */

  async function loginUser() {
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: login.email,
        password: login.password,
      });

    if (error) {
      if (
        error.message
          .toLowerCase()
          .includes("email not confirmed")
      ) {
        setRegisteredEmail(login.email);

        setSuccessTitle(
          "Verify Your Email"
        );

        setSuccessDescription(
          "Please verify your email before logging in. We've already sent a verification email to"
        );

        setShowSuccess(true);

        toast.error(
          "Please verify your email first."
        );

        setLoading(false);
        return;
      }

      toast.error(error.message);

      setLoading(false);
      return;
    }

    toast.success("Welcome back!");

    onOpenChange(false);

    setLoading(false);
  }

  /* ---------------- RESEND EMAIL ---------------- */

  async function resendVerificationEmail() {
    const { error } =
      await supabase.auth.resend({
        type: "signup",
        email: registeredEmail,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Verification email sent again."
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          setShowSuccess(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to Tattva
          </DialogTitle>

          <DialogDescription>
            Login or create your student account to
            continue.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <RegistrationSuccess
            email={registeredEmail}
            title={successTitle}
            description={successDescription}
            onLogin={() =>
              setShowSuccess(false)
            }
            onResend={
              resendVerificationEmail
            }
          />
        ) : (
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                Login
              </TabsTrigger>

              <TabsTrigger value="register">
                Register
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}

            <TabsContent value="login">
              <div className="space-y-5">
                <div>
                  <Label>Email</Label>

                  <Input
                    type="email"
                    value={login.email}
                    onChange={(e) =>
                      setLogin({
                        ...login,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Password</Label>

                  <Input
                    type="password"
                    value={login.password}
                    onChange={(e) =>
                      setLogin({
                        ...login,
                        password:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={loginUser}
                >
                  {loading
                    ? "Please wait..."
                    : "Login"}
                </Button>
              </div>
            </TabsContent>

            {/* REGISTER */}

            <TabsContent value="register">
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>

                  <Input
                    value={register.full_name}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        full_name:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>

                  <Input
                    type="email"
                    value={register.email}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        email:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Password</Label>

                  <Input
                    type="password"
                    value={register.password}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        password:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Phone</Label>

                  <Input
                    value={register.phone}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        phone:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Grade</Label>

                  <Input
                    value={register.grade}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        grade:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Country</Label>

                  <Input
                    value={register.country}
                    onChange={(e) =>
                      setRegister({
                        ...register,
                        country:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={registerUser}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}