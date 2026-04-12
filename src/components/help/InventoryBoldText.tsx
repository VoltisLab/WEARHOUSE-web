/** Renders strings that use `**markdown**` bold segments from the inventory doc. */
export function InventoryBoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        if (m) {
          return (
            <strong key={i} className="font-semibold text-prel-label">
              {m[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
