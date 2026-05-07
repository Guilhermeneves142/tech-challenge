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
    disabled
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer hover:bg-gray-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconWrapClass = [
    "flex items-center justify-center rounded-full p-3",
    disabled
      ? "bg-gray-200 text-text-disabled"
      : "bg-brand-secondary text-brand-primary",
  ].join(" ");

  const labelClass = [
    "pt-2 text-[18px] font-medium",
    disabled ? "text-text-disabled" : "text-text-primary",
  ].join(" ");

  const iconNode = (
    <span className={iconWrapClass}>
      <Icon className="size-6 shrink-0" aria-hidden />
    </span>
  );

  if (disabled) {
    return (
      <span className={cardClass} aria-disabled="true" tabIndex={-1}>
        {iconNode}
        <span className={labelClass}>{text}</span>
      </span>
    );
  }

  return (
    <Link href={route} className={cardClass}>
      {iconNode}
      <span className={labelClass}>{text}</span>
    </Link>
  );
}
