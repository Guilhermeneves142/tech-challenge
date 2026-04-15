type IconProps = {
  className?: string;
};

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.66667 7V3H15V7H9.66667ZM3 9.66667V3H8.33333V9.66667H3ZM9.66667 15V8.33333H15V15H9.66667ZM3 15V11H8.33333V15H3Z"
        fill="currentColor"
      />
    </svg>
  );
}
