import type {
  InventoryManifestBlock,
  InventoryManifestSection,
} from "@/lib/help-centre-inventory-manifest-data";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { InventoryRichText } from "./InventoryRichText";

function ManifestBlockView({ block }: { block: InventoryManifestBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[15px] leading-relaxed text-prel-secondary-label">
          <InventoryRichText text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h4 className="mt-6 text-[15px] font-bold text-prel-label first:mt-0">
          <InventoryRichText text={block.text} />
        </h4>
      );
    case "list":
      return (
        <ul className="mt-2 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-prel-secondary-label">
          {block.items.map((item, j) => (
            <li key={j}>
              <InventoryRichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "ordered":
      return (
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-prel-secondary-label">
          {block.items.map((item, j) => (
            <li key={j}>
              <InventoryRichText text={item} />
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-prel-bg-grouped/90 p-4 text-[13px] leading-relaxed text-prel-label">
          {block.text}
        </pre>
      );
    case "table": {
      const longRows = block.rows.length > 24;
      const wrapClass = longRows
        ? "max-h-[min(28rem,70vh)] overflow-y-auto rounded-xl border border-prel-separator/50"
        : "";
      return (
        <div className={`mt-3 overflow-x-auto ${wrapClass}`}>
          <table className="w-full min-w-[28rem] border-collapse text-left text-[13px]">
            {block.headers ? (
              <thead className="sticky top-0 bg-prel-bg-grouped/95 backdrop-blur-sm">
                <tr>
                  {block.headers.map((h, j) => (
                    <th
                      key={j}
                      className="border-b border-prel-separator/50 px-3 py-2 font-semibold text-prel-label"
                    >
                      <InventoryRichText text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-prel-separator/40 last:border-0"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="align-top px-3 py-2 text-prel-secondary-label"
                    >
                      <InventoryRichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return null;
  }
}

export function HelpInventoryManifestSection({
  section,
}: {
  section: InventoryManifestSection;
}) {
  return (
    <MarketingDetails title={<InventoryRichText text={section.title} />}>
      <div className="space-y-3 pt-1">
        {section.blocks.map((b, i) => (
          <ManifestBlockView key={i} block={b} />
        ))}
      </div>
    </MarketingDetails>
  );
}
