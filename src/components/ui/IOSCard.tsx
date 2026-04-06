export function IOSCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-ios-lg border border-prel-separator/60 bg-prel-card shadow-ios ${className}`}
    >
      {children}
    </div>
  );
}
