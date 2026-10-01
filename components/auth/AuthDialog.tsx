"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { countryCodes, defaultCountryCode } from "@/data/countryCodes";
import { useCountdown } from "@/hooks/useCountdown";

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
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Method = "email" | "phone";

const OTP_RESEND_SECONDS = 45;

/** Small "Email / Phone" segmented switch, shared by the login and register forms. */
function MethodSwitch({
  value,
  onChange,
}: {
  value: Method;
  onChange: (m: Method) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-muted p-1">
      {(
        [
          { id: "email" as const, label: "Email", icon: Mail },
          { id: "phone" as const, label: "Phone (SMS)", icon: MessageSquare },
        ]
      ).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all",
            value === id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default function AuthDialog({ open, onOpenChange }: Props) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [successTitle, setSuccessTitle] = useState("Registration Successful");
  const [successDescription, setSuccessDescription] = useState(
    "We've sent a verification email to"
  );

  /* ---------------- method selection ---------------- */

  const [loginMethod, setLoginMethod] = useState<Method>("email");
  const [registerMethod, setRegisterMethod] = useState<Method>("email");

  /* ---------------- email login ---------------- */

  const [login, setLogin] = useState({ email: "", password: "" });

  /* ---------------- email register ---------------- */

  const [register, setRegister] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    grade: "",
    country: "",
  });

  /* ---------------- phone login (OTP) ---------------- */

  const [loginPhoneCountry, setLoginPhoneCountry] = useState(
    defaultCountryCode.iso2
  );
  const [loginPhoneNumber, setLoginPhoneNumber] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const loginCountdown = useCountdown();

  /* ---------------- phone register (OTP) ---------------- */

  const [registerPhone, setRegisterPhone] = useState({
    full_name: "",
    grade: "",
    country: "",
  });
  const [registerPhoneCountry, setRegisterPhoneCountry] = useState(
    defaultCountryCode.iso2
  );
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState("");
  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [registerOtp, setRegisterOtp] = useState("");
  const registerCountdown = useCountdown();

  const loginDialCode = useMemo(
    () =>
      countryCodes.find((c) => c.iso2 === loginPhoneCountry) ??
      defaultCountryCode,
    [loginPhoneCountry]
  );

  const registerDialCode = useMemo(
    () =>
      countryCodes.find((c) => c.iso2 === registerPhoneCountry) ??
      defaultCountryCode,
    [registerPhoneCountry]
  );

  const loginPhoneValid = useMemo(() => {
    if (!loginPhoneNumber.trim()) return false;
    try {
      return isValidPhoneNumber(loginPhoneNumber.trim(), loginPhoneCountry);
    } catch {
      return false;
    }
  }, [loginPhoneNumber, loginPhoneCountry]);

  const registerPhoneValid = useMemo(() => {
    if (!registerPhoneNumber.trim()) return false;
    try {
      return isValidPhoneNumber(
        registerPhoneNumber.trim(),
        registerPhoneCountry
      );
    } catch {
      return false;
    }
  }, [registerPhoneNumber, registerPhoneCountry]);

  function resetAll() {
    setShowSuccess(false);
    setLoginOtpSent(false);
    setLoginOtp("");
    setRegisterOtpSent(false);
    setRegisterOtp("");
  }

  /* ================= EMAIL — REGISTER ================= */

  async function registerWithEmail() {
    if (!register.full_name.trim() || !register.email.trim() || !register.password) {
      toast.error("Please fill in your name, email and password.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: register.email.trim(),
      password: register.password,
      options: {
        data: {
          full_name: register.full_name.trim(),
          phone: register.phone.trim(),
          grade: register.grade.trim(),
          country: register.country.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.user) {
      setRegisteredEmail(register.email.trim());
      setSuccessTitle("Registration Successful");
      setSuccessDescription("We've sent a verification email to");
      setShowSuccess(true);
      toast.success("Verification email sent successfully.");
    }
  }

  /* ================= EMAIL — LOGIN ================= */

  async function loginWithEmail() {
    if (!login.email.trim() || !login.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: login.email.trim(),
      password: login.password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setRegisteredEmail(login.email.trim());
        setSuccessTitle("Verify Your Email");
        setSuccessDescription(
          "Please verify your email before logging in. We've already sent a verification email to"
        );
        setShowSuccess(true);
        toast.error("Please verify your email first.");
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

  async function resendVerificationEmail() {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: registeredEmail,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Verification email sent again.");
  }

  /* ================= PHONE — LOGIN ================= */

  async function sendLoginOtp() {
    if (!loginPhoneValid) {
      toast.error(`Enter a valid phone number for ${loginDialCode.name}.`);
      return;
    }

    setLoading(true);

    const phone = `${loginDialCode.dialCode}${loginPhoneNumber.replace(/\s+/g, "")}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("signups not allowed")) {
        toast.error("No account found with this number. Please register first.");
        return;
      }

      toast.error(error.message);
      return;
    }

    setLoginOtpSent(true);
    loginCountdown.start(OTP_RESEND_SECONDS);
    toast.success("OTP sent via SMS.");
  }

  async function verifyLoginOtp() {
    if (loginOtp.trim().length < 4) {
      toast.error("Enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);

    const phone = `${loginDialCode.dialCode}${loginPhoneNumber.replace(/\s+/g, "")}`;

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: loginOtp.trim(),
      type: "sms",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    onOpenChange(false);
  }

  /* ================= PHONE — REGISTER ================= */

  async function sendRegisterOtp() {
    if (!registerPhone.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!registerPhoneValid) {
      toast.error(`Enter a valid phone number for ${registerDialCode.name}.`);
      return;
    }

    setLoading(true);

    const phone = `${registerDialCode.dialCode}${registerPhoneNumber.replace(/\s+/g, "")}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: registerPhone.full_name.trim(),
          phone,
          grade: registerPhone.grade.trim(),
          country: registerPhone.country.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setRegisterOtpSent(true);
    registerCountdown.start(OTP_RESEND_SECONDS);
    toast.success("OTP sent via SMS.");
  }

  async function verifyRegisterOtp() {
    if (registerOtp.trim().length < 4) {
      toast.error("Enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);

    const phone = `${registerDialCode.dialCode}${registerPhoneNumber.replace(/\s+/g, "")}`;

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: registerOtp.trim(),
      type: "sms",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created! You're logged in.");
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) resetAll();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Tattva</DialogTitle>

          <DialogDescription>
            Login or create your student account with email or phone — whichever is easiest for you.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <RegistrationSuccess
            email={registeredEmail}
            title={successTitle}
            description={successDescription}
            onLogin={() => setShowSuccess(false)}
            onResend={resendVerificationEmail}
          />
        ) : (
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* ===================== LOGIN ===================== */}

            <TabsContent value="login">
              <div className="space-y-5">
                <MethodSwitch value={loginMethod} onChange={setLoginMethod} />

                {loginMethod === "email" ? (
                  <div className="space-y-5">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={login.email}
                        onChange={(e) =>
                          setLogin({ ...login, email: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={login.password}
                        onChange={(e) =>
                          setLogin({ ...login, password: e.target.value })
                        }
                        onKeyDown={(e) => e.key === "Enter" && loginWithEmail()}
                      />
                    </div>

                    <Button
                      className="w-full"
                      disabled={loading}
                      onClick={loginWithEmail}
                    >
                      {loading ? "Please wait..." : "Login"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {!loginOtpSent ? (
                      <>
                        <div>
                          <Label>Phone Number</Label>
                          <div className="mt-1.5 flex gap-2">
                            <select
                              value={loginPhoneCountry}
                              onChange={(e) =>
                                setLoginPhoneCountry(
                                  e.target.value as typeof loginPhoneCountry
                                )
                              }
                              aria-label="Country code"
                              className="w-[6.5rem] shrink-0 rounded-xl border bg-background px-2 py-2 text-sm outline-none focus:border-primary sm:w-36"
                            >
                              {countryCodes.map((item) => (
                                <option key={item.iso2} value={item.iso2}>
                                  {item.flag} {item.dialCode}
                                </option>
                              ))}
                            </select>

                            <Input
                              type="tel"
                              value={loginPhoneNumber}
                              onChange={(e) =>
                                setLoginPhoneNumber(
                                  e.target.value.replace(/[^\d\s]/g, "")
                                )
                              }
                              placeholder="98765 43210"
                              className="min-w-0"
                            />
                          </div>

                          {loginPhoneNumber.length > 0 && !loginPhoneValid && (
                            <p className="mt-2 text-xs text-red-500">
                              Enter a valid number for {loginDialCode.name}
                            </p>
                          )}
                        </div>

                        <Button
                          className="w-full"
                          disabled={loading}
                          onClick={sendLoginOtp}
                        >
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                          Code sent to {loginDialCode.dialCode}{" "}
                          {loginPhoneNumber}
                        </div>

                        <div>
                          <Label>Enter OTP</Label>
                          <Input
                            inputMode="numeric"
                            value={loginOtp}
                            onChange={(e) =>
                              setLoginOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-lg tracking-[0.5em]"
                            onKeyDown={(e) =>
                              e.key === "Enter" && verifyLoginOtp()
                            }
                          />
                        </div>

                        <Button
                          className="w-full"
                          disabled={loading}
                          onClick={verifyLoginOtp}
                        >
                          {loading ? "Verifying..." : "Verify & Login"}
                        </Button>

                        <div className="flex items-center justify-between text-sm">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setLoginOtpSent(false);
                              setLoginOtp("");
                            }}
                          >
                            Change number
                          </button>

                          <button
                            type="button"
                            disabled={loginCountdown.seconds > 0 || loading}
                            className="font-medium text-primary disabled:text-muted-foreground"
                            onClick={sendLoginOtp}
                          >
                            {loginCountdown.seconds > 0
                              ? `Resend in ${loginCountdown.seconds}s`
                              : "Resend OTP"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ===================== REGISTER ===================== */}

            <TabsContent value="register">
              <div className="space-y-5">
                <MethodSwitch
                  value={registerMethod}
                  onChange={setRegisterMethod}
                />

                {registerMethod === "email" ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={register.full_name}
                        onChange={(e) =>
                          setRegister({
                            ...register,
                            full_name: e.target.value,
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
                          setRegister({ ...register, email: e.target.value })
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
                            password: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={register.phone}
                        onChange={(e) =>
                          setRegister({ ...register, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Grade</Label>
                      <Input
                        value={register.grade}
                        onChange={(e) =>
                          setRegister({ ...register, grade: e.target.value })
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
                            country: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Button
                      className="w-full"
                      disabled={loading}
                      onClick={registerWithEmail}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!registerOtpSent ? (
                      <>
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={registerPhone.full_name}
                            onChange={(e) =>
                              setRegisterPhone({
                                ...registerPhone,
                                full_name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label>Phone Number</Label>
                          <div className="mt-1.5 flex gap-2">
                            <select
                              value={registerPhoneCountry}
                              onChange={(e) =>
                                setRegisterPhoneCountry(
                                  e.target.value as typeof registerPhoneCountry
                                )
                              }
                              aria-label="Country code"
                              className="w-[6.5rem] shrink-0 rounded-xl border bg-background px-2 py-2 text-sm outline-none focus:border-primary sm:w-36"
                            >
                              {countryCodes.map((item) => (
                                <option key={item.iso2} value={item.iso2}>
                                  {item.flag} {item.dialCode}
                                </option>
                              ))}
                            </select>

                            <Input
                              type="tel"
                              value={registerPhoneNumber}
                              onChange={(e) =>
                                setRegisterPhoneNumber(
                                  e.target.value.replace(/[^\d\s]/g, "")
                                )
                              }
                              placeholder="98765 43210"
                              className="min-w-0"
                            />
                          </div>

                          {registerPhoneNumber.length > 0 &&
                            !registerPhoneValid && (
                              <p className="mt-2 text-xs text-red-500">
                                Enter a valid number for {registerDialCode.name}
                              </p>
                            )}
                        </div>

                        <div>
                          <Label>Grade</Label>
                          <Input
                            value={registerPhone.grade}
                            onChange={(e) =>
                              setRegisterPhone({
                                ...registerPhone,
                                grade: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label>Country</Label>
                          <Input
                            value={registerPhone.country}
                            onChange={(e) =>
                              setRegisterPhone({
                                ...registerPhone,
                                country: e.target.value,
                              })
                            }
                          />
                        </div>

                        <Button
                          className="w-full"
                          disabled={loading}
                          onClick={sendRegisterOtp}
                        >
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                          Code sent to {registerDialCode.dialCode}{" "}
                          {registerPhoneNumber}
                        </div>

                        <div>
                          <Label>Enter OTP</Label>
                          <Input
                            inputMode="numeric"
                            value={registerOtp}
                            onChange={(e) =>
                              setRegisterOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-lg tracking-[0.5em]"
                            onKeyDown={(e) =>
                              e.key === "Enter" && verifyRegisterOtp()
                            }
                          />
                        </div>

                        <Button
                          className="w-full"
                          disabled={loading}
                          onClick={verifyRegisterOtp}
                        >
                          {loading ? "Verifying..." : "Verify & Create Account"}
                        </Button>

                        <div className="flex items-center justify-between text-sm">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setRegisterOtpSent(false);
                              setRegisterOtp("");
                            }}
                          >
                            Change number
                          </button>

                          <button
                            type="button"
                            disabled={registerCountdown.seconds > 0 || loading}
                            className="font-medium text-primary disabled:text-muted-foreground"
                            onClick={sendRegisterOtp}
                          >
                            {registerCountdown.seconds > 0
                              ? `Resend in ${registerCountdown.seconds}s`
                              : "Resend OTP"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
