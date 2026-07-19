"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  countryCodes,
  defaultCountryCode,
} from "@/data/countryCodes";

interface TrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OTHER = "Other";

const countries = [
  "India",
  "USA",
  "Canada",
  "Australia",
  "United Kingdom",
  "Singapore",
  "UAE",
  OTHER,
];

const grades = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
  OTHER,
];

const subjects = [
  "Mathematics",
  "Physics",
  OTHER,
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
  OTHER,
];

export default function TrialModal({
  open,
  onOpenChange,
}: TrialModalProps) {
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");

  const [phoneCountry, setPhoneCountry] = useState(
    defaultCountryCode.iso2
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");

  const [country, setCountry] = useState("India");
  const [countryOther, setCountryOther] = useState("");

  const [grade, setGrade] = useState("");
  const [gradeOther, setGradeOther] = useState("");

  const [subject, setSubject] = useState("");
  const [subjectOther, setSubjectOther] = useState("");

  const [curriculum, setCurriculum] = useState("");
  const [curriculumOther, setCurriculumOther] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedDialCode = useMemo(
    () =>
      countryCodes.find((item) => item.iso2 === phoneCountry) ??
      defaultCountryCode,
    [phoneCountry]
  );

  const isPhoneValid = useMemo(() => {
    if (!phoneNumber.trim()) return false;

    try {
      return isValidPhoneNumber(phoneNumber.trim(), phoneCountry);
    } catch {
      return false;
    }
  }, [phoneNumber, phoneCountry]);

  const finalCountry =
    country === OTHER ? countryOther.trim() : country;

  const finalGrade =
    grade === OTHER ? gradeOther.trim() : grade;

  const finalSubject =
    subject === OTHER ? subjectOther.trim() : subject;

  const finalCurriculum =
    curriculum === OTHER ? curriculumOther.trim() : curriculum;

  const isValid =
    parentName.trim().length >= 3 &&
    studentName.trim().length >= 2 &&
    isPhoneValid &&
    email.trim().length > 5 &&
    finalCountry !== "" &&
    finalGrade !== "" &&
    finalSubject !== "" &&
    finalCurriculum !== "";

    async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
    ) {
    e.preventDefault();

    if (!isValid || loading) return;

    setLoading(true);

    const whatsapp = `${selectedDialCode.dialCode} ${phoneNumber.trim()}`;

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
            country: finalCountry,
            grade: finalGrade,
            subject: finalSubject,
            curriculum: finalCurriculum,
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
        setPhoneCountry(defaultCountryCode.iso2);
        setPhoneNumber("");
        setEmail("");
        setCountry("India");
        setCountryOther("");
        setGrade("");
        setGradeOther("");
        setSubject("");
        setSubjectOther("");
        setCurriculum("");
        setCurriculumOther("");

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
            Fill in the details below and we&apos;ll contact you shortly.
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
                Parent&apos;s Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={parentName}
                onChange={(e) =>
                  setParentName(e.target.value)
                }
                placeholder="Enter parent's name"
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
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
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
              />

              {studentName.length > 0 && studentName.length < 2 && (
                <p className="mt-2 text-xs text-red-500">
                  Minimum 2 characters
                </p>
              )}

            </div>

            {/* WhatsApp — country code + number, validated per country */}

            <div>
              <label className="mb-2 block font-medium">
                Parent&apos;s WhatsApp Number
                <span className="text-red-500"> *</span>
              </label>

              <div className="flex gap-2">

                <select
                  value={phoneCountry}
                  onChange={(e) =>
                    setPhoneCountry(e.target.value as typeof phoneCountry)
                  }
                  aria-label="WhatsApp country code"
                  className="w-[6.5rem] shrink-0 rounded-xl border bg-background px-2 py-3 text-sm outline-none focus:border-primary sm:w-36"
                >
                  {countryCodes.map((item) => (
                    <option
                      key={item.iso2}
                      value={item.iso2}
                    >
                      {item.flag} {item.dialCode}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/[^\d\s]/g, "")
                    )
                  }
                  placeholder="98765 43210"
                  className="w-full min-w-0 rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />

              </div>

              {phoneNumber.length > 0 && !isPhoneValid && (
                <p className="mt-2 text-xs text-red-500">
                  Enter a valid WhatsApp number for {selectedDialCode.name}
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
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
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
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
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

              {country === OTHER && (
                <input
                  type="text"
                  value={countryOther}
                  onChange={(e) => setCountryOther(e.target.value)}
                  placeholder="Please specify your country"
                  className="mt-3 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              )}
            </div>

            {/* Grade / Year */}

            <div>
              <label className="mb-2 block font-medium">
                Grade / Year
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select Grade / Year</option>

                {grades.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              {grade === OTHER && (
                <input
                  type="text"
                  value={gradeOther}
                  onChange={(e) => setGradeOther(e.target.value)}
                  placeholder="Please specify grade / year"
                  className="mt-3 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              )}
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
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select Subject</option>

                {subjects.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              {subject === OTHER && (
                <input
                  type="text"
                  value={subjectOther}
                  onChange={(e) => setSubjectOther(e.target.value)}
                  placeholder="Please specify subject"
                  className="mt-3 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              )}
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
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
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

              {curriculum === OTHER && (
                <input
                  type="text"
                  value={curriculumOther}
                  onChange={(e) => setCurriculumOther(e.target.value)}
                  placeholder="Please specify curriculum"
                  className="mt-3 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              )}
            </div>

              <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`group relative w-full overflow-hidden rounded-2xl py-4 font-bold transition-all duration-300
                  ${
                      isValid
                      ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:scale-[1.02] hover:shadow-2xl"
                      : "cursor-not-allowed bg-muted text-muted-foreground"
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
