import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  text: string;
  icon: LucideIcon;
  className?: string;
  route: string;
  disabled?: boolean;
};

export default function ActionButton({
  text,
  icon: Icon,
  className,
  route,
  disabled = false,
}: Props) {
  const cardClass = [
    "flex flex-col items-center justify-center bg-white py-6 shadow",
    disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

    const iconWrapClass = [
      "flex items-center justify-center rounded-full p-3",
      disabled
        ? "bg-gray-200 text-text-tertiary"
        : "bg-brand-secondary text-brand-primary",
    ].join(" ");
    
    const labelClass = [
      "pt-2 text-[18px] font-medium",
      disabled ? "text-text-tertiary" : "text-text-primary",
    ].join(" ");

  const content = (
    <>
      <span className={iconWrapClass}>
        <Icon className="size-6 shrink-0" aria-hidden />
      </span>
      <span className={labelClass}>{text}</span>
    </>
  );

  if (disabled) {
    return (
      <button type="button" className={cardClass} disabled title="Disponível em breve">
        {content}
      </button>
    );
  }

  return (
    <Link href={route} className={cardClass}>
      {content}
    </Link>
  );
}