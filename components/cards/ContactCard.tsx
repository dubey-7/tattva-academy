import { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href: string;
}

export default function ContactCard({
  icon: Icon,
  title,
  value,
  href,
}: ContactCardProps) {
  return (
    <a
      href={href}
      className="group rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 break-words text-muted-foreground transition-colors group-hover:text-foreground">
        {value}
      </p>
    </a>
  );
}