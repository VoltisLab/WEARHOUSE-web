"use client";

import { useEffect, useState } from "react";

/**
 * © Voltislabs with current calendar year; re-reads on an interval so long-lived
 * tabs pick up the new year without a full reload.
 */
export function VoltislabsCopyright({
  className = "",
}: {
  className?: string;
}) {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const sync = () => setYear(new Date().getFullYear());
    sync();
    const id = setInterval(sync, 3_600_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={className}>
      © Voltislabs {year}
    </p>
  );
}
