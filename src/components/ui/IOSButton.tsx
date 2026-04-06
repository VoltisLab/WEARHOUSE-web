export function IOSButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "destructive";
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "min-h-[44px] w-full rounded-[10px] px-4 text-[17px] font-semibold transition-opacity active:opacity-90";
  const styles =
    variant === "primary"
      ? "prel-btn-primary"
      : variant === "destructive"
        ? "bg-red-500 text-white"
        : "prel-btn-secondary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
