export type UserRole = "student" | "admin";

export interface Profile {
  id: string;

  full_name: string;
  phone: string;
  grade: string;
  country: string;

  curriculum: string | null;
  role: UserRole;
}
