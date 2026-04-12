import { InventoryBoldText } from "./InventoryBoldText";

function isHttpUrl(href: string) {
  return /^https?:\/\//i.test(href);
}

function InventoryInlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-prel-bg-grouped px-1 py-px text-[13px] font-mono text-prel-label"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <InventoryBoldText key={i} text={part} />;
      })}
    </>
  );
}

/** Bold, inline code, and markdown links from inventory strings. */
export function InventoryRichText({ text }: { text: string }) {
  const linkParts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {linkParts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const label = m[1];
          const href = m[2];
          if (isHttpUrl(href)) {
            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--prel-primary)] underline-offset-2 hover:underline"
              >
                {label}
              </a>
            );
          }
          return (
            <span
              key={i}
              className="font-medium text-prel-label"
              title={href}
            >
              {label}
            </span>
          );
        }
        return <InventoryInlineText key={i} text={part} />;
      })}
    </>
  );
}
