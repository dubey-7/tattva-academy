"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrialModal({
  open,
  onOpenChange,
}: TrialModalProps) {
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("India");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid =
    parentName.trim().length >= 3 &&
    studentName.trim().length >= 2 &&
    whatsapp.trim().length >= 10 &&
    email.trim().length > 5 &&
    grade.trim() !== "" &&
    subject !== "" &&
    curriculum !== "";

    async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
    ) {
    e.preventDefault();

    if (!isValid || loading) return;

    setLoading(true);

    try {
        const response = await fetch("/api/trial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            parent_name: parentName,
            student_name: studentName,
            whatsapp,
            email,
            country,
            grade,
            subject,
            curriculum,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        toast.error(data.message);
        setLoading(false);
        return;
        }

        toast.success("Trial booked successfully!");

        setSuccess(true);

        setTimeout(() => {
        setParentName("");
        setStudentName("");
        setWhatsapp("");
        setEmail("");
        setCountry("India");
        setGrade("");
        setSubject("");
        setCurriculum("");

        setSuccess(false);
        setLoading(false);

        onOpenChange(false);
        }, 2000);
    } catch (err) {
        console.error(err);

        toast.error("Something went wrong.");

        setLoading(false);
    }
    }

    const countries = [
        "India",
        "USA",
        "Canada",
        "Australia",
        "United Kingdom",
        "Singapore",
        "UAE",
        "Other",
      ];
    
    const curriculums = [
      "IB DP",
      "IB MYP",
      "IGCSE",
      "GCSE",
      "A Level",
      "SAT",
      "CBSE",
      "ICSE",
    ];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle className="text-3xl font-bold">
            📚 Book Your Free Trial
          </DialogTitle>

          <DialogDescription>
            Fill in the details below and we'll contact you shortly.
          </DialogDescription>

        </DialogHeader>

        {success ? (

          <div className="space-y-6 py-12 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
              ✅
            </div>

            <h2 className="text-3xl font-bold">
              Free Trial Booked!
            </h2>

            <p className="mx-auto max-w-md text-muted-foreground">
              Thank you for choosing Tattva.

              <br />

              Our team will contact you shortly on your WhatsApp number.
            </p>

          </div>

        ) : (

          <form
              onSubmit={handleSubmit}
              className="space-y-5 pt-4"
          >

            {/* Parent Name */}

            <div>
              <label className="mb-2 block font-medium">
                Parent's Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={parentName}
                onChange={(e) =>
                  setParentName(e.target.value)
                }
                placeholder="Enter parent's name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              />

              {parentName.length > 0 && parentName.length < 3 && (
                <p className="mt-2 text-xs text-red-500">
                  Minimum 3 characters
                </p>
              )}

            </div>

            {/* Student Name */}

            <div>
              <label className="mb-2 block font-medium">
                Student Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
                placeholder="Enter student name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              />

              {studentName.length > 0 && studentName.length < 2 && (
                <p className="mt-2 text-xs text-red-500">
                  Minimum 2 characters
                </p>
              )}

            </div>

            {/* WhatsApp */}

            <div>
              <label className="mb-2 block font-medium">
                Parent's WhatsApp Number
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="tel"
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              />

              {whatsapp.length > 0 && whatsapp.length < 10 && (
                <p className="mt-2 text-xs text-red-500">
                  Enter a valid WhatsApp number
                </p>
              )}

            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block font-medium">
                Email Address
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="example@gmail.com"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              />

              {email.length > 0 &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="mt-2 text-xs text-red-500">
                  Enter a valid email address
                </p>
              )}

            </div>

            {/* Country */}

            <div>
              <label className="mb-2 block font-medium">
                Country
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              >
                {countries.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}

            <div>
              <label className="mb-2 block font-medium">
                Grade
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select Grade</option>

                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>

            {/* Subject */}

            <div>
              <label className="mb-2 block font-medium">
                Subject
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select Subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>

            {/* Curriculum */}

            <div>
              <label className="mb-2 block font-medium">
                Curriculum
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={curriculum}
                onChange={(e) =>
                  setCurriculum(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-primary"
              >
                  <option value="">
                      Select Curriculum
                  </option>

                  {curriculums.map((item)=>(
                      <option
                          key={item}
                          value={item}
                      >
                          {item}
                      </option>
                  ))}

              </select>
            </div>
                
              <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`group relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white transition-all duration-300
                  ${
                      isValid
                      ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:scale-[1.02] hover:shadow-2xl"
                      : "cursor-not-allowed bg-gray-300"
                  }`}
              >
                  {isValid && (
                      <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[180%]" />
                  )}

                  <span className="relative">
                      {loading ? "Booking Trial..." : "Book Free Trial"}
                  </span>
              </button>

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}