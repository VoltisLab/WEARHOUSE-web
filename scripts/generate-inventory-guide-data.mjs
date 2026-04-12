/**
 * Parses PreluraSwift HELP_CENTRE_FEATURE_INVENTORY.md into:
 * - src/lib/help-centre-inventory-guide-data.ts (commercial feature list)
 * - src/lib/help-centre-inventory-manifest-data.ts (§1–§5, §8, §9 — technical & authoring)
 * - src/lib/help-centre-inventory-appendix.ts (§6 persona QA, §7 URLs + legal note)
 *
 * Run from prelura-admin-web: node scripts/generate-inventory-guide-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.join(__dirname, "..");
const inventoryPath = path.join(
  adminRoot,
  "..",
  "PreluraSwift",
  "HELP_CENTRE_FEATURE_INVENTORY.md",
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractPrologue(md) {
  const end = md.indexOf("\n## Simple feature list");
  if (end === -1) throw new Error("Could not find ## Simple feature list");
  const chunk = md.slice(0, end);
  const lines = chunk.split("\n");
  const paras = [];
  let cur = [];
  for (const line of lines) {
    if (line.startsWith("# ")) continue;
    if (line.trim() === "---") {
      if (cur.length) {
        paras.push(cur.join(" "));
        cur = [];
      }
      continue;
    }
    if (!line.trim()) {
      if (cur.length) {
        paras.push(cur.join(" "));
        cur = [];
      }
    } else {
      cur.push(line.trim());
    }
  }
  if (cur.length) paras.push(cur.join(" "));
  return paras.filter(Boolean);
}

function parseFeatureBlocks(md) {
  const start = md.indexOf("## Simple feature list");
  const end = md.indexOf("\n## 1. DNS");
  if (start === -1 || end === -1) {
    throw new Error("Could not find Simple feature list or ## 1. DNS");
  }
  const section = md.slice(start, end);
  const parts = section.split(/\n### /).slice(1);
  return parts.map((raw) => {
    const lines = raw.trim().split("\n");
    const titleRaw = lines[0].trim();
    const body = lines.slice(1).join("\n");
    const title =
      titleRaw === "Make an offer" ? "Send an offer" : titleRaw;

    let why = "";
    const whyM = body.match(
      /\*\*Why it matters:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/,
    );
    if (whyM) why = whyM[1].replace(/\s+/g, " ").replace(/\s*---\s*$/g, "").trim();

    let steps = [];
    const stepRe = /Step \d+:\s*([^\n]+)/g;
    let m;
    while ((m = stepRe.exec(body)) !== null) {
      steps.push(m[1].trim());
    }

    let expect = "";
    const expM = body.match(
      /\*\*What to expect:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/,
    );
    if (expM) expect = expM[1].replace(/\s+/g, " ").replace(/\s*---\s*$/g, "").trim();

    let goodToKnow = "";
    const gtkM = body.match(
      /\*\*Good to know:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/,
    );
    if (gtkM)
      goodToKnow = gtkM[1].replace(/\s+/g, " ").replace(/\s*---\s*$/g, "").trim();

    function polish(s) {
      return s
        .replace(/\s*---\s*$/g, "")
        .replace(/\*\*Make an offer\*\*/g, "**Send an offer**")
        .replace(/Use \*\*Buy\*\* \(or equivalent primary action\)/g, "Use **Buy now**")
        .replace(/Tap \*\*Buy\*\* \/ \*\*Checkout\*\*/g, "Tap **Buy now** / **Checkout**")
        .replace(
          /From a product page or bag, tap \*\*Buy\*\* \/ \*\*Checkout\*\*\./g,
          "From a product page or bag, tap **Buy now** / **Checkout**.",
        )
        .replace(/From a product page, tap \*\*Make an offer\*\*/g, "From a product page, tap **Send an offer**");
    }
    why = polish(why);
    steps = steps.map(polish);
    if (expect) expect = polish(expect);
    if (goodToKnow) goodToKnow = polish(goodToKnow);

    return {
      id: slugify(titleRaw),
      title,
      why,
      steps,
      expect: expect || undefined,
      goodToKnow: goodToKnow || undefined,
    };
  });
}

const GROUP_BREAKS = [
  { afterId: "account-restriction-moderation", title: "Home & Discover" },
  { afterId: "discover-search-and-member-search", title: "Shopping & checkout" },
  { afterId: "payment-success", title: "Your shop, profile & menu" },
  { afterId: "invite-a-friend", title: "About, legal & settings" },
  { afterId: "email-notification-preferences", title: "Sell, Inbox & support" },
];

function buildGroups(features) {
  const groups = [];
  let current = { title: "Getting started", items: [] };
  const breakById = new Map(GROUP_BREAKS.map((g) => [g.afterId, g.title]));

  for (const f of features) {
    current.items.push(f);
    const nextTitle = breakById.get(f.id);
    if (nextTitle) {
      groups.push(current);
      current = { title: nextTitle, items: [] };
    }
  }
  groups.push(current);
  return groups;
}

function parseTableLines(tableLines) {
  const rows = tableLines.map((l) =>
    l
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim()),
  );
  if (rows.length < 2) {
    return { type: "table", headers: null, rows };
  }
  const sep = rows[1].every((c) => /^[-:\s]+$/.test(c));
  if (sep) {
    return { type: "table", headers: rows[0], rows: rows.slice(2) };
  }
  return { type: "table", headers: null, rows };
}

function parseBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;

  function flushParagraph(buf) {
    const t = buf.join("\n").trim();
    if (t) {
      blocks.push({ type: "paragraph", text: t.replace(/\n+/g, " ") });
    }
  }

  let paraBuf = [];

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    if (!t) {
      flushParagraph(paraBuf);
      paraBuf = [];
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph(paraBuf);
      paraBuf = [];
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }

    if (t.startsWith("|")) {
      flushParagraph(paraBuf);
      paraBuf = [];
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(parseTableLines(tableLines));
      continue;
    }

    if (/^[-*]\s/.test(t)) {
      flushParagraph(paraBuf);
      paraBuf = [];
      const items = [];
      while (i < lines.length) {
        const L = lines[i];
        const Tr = L.trim();
        if (!Tr) break;
        const m = Tr.match(/^[-*]\s+(?:\[[ x]\]\s*)?(.+)/);
        if (!m) break;
        items.push(m[1].trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (/^\d+\.\s/.test(t)) {
      flushParagraph(paraBuf);
      paraBuf = [];
      const items = [];
      while (i < lines.length) {
        const L = lines[i];
        const Tr = L.trim();
        if (!Tr) break;
        const m = Tr.match(/^\d+\.\s+(.+)/);
        if (!m) break;
        items.push(m[1].trim());
        i++;
      }
      blocks.push({ type: "ordered", items });
      continue;
    }

    if (t.startsWith("```")) {
      flushParagraph(paraBuf);
      paraBuf = [];
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    if (t === "---") {
      flushParagraph(paraBuf);
      paraBuf = [];
      i++;
      continue;
    }

    paraBuf.push(line);
    i++;
  }
  flushParagraph(paraBuf);
  return blocks;
}

function splitTopLevelSections(tailMd) {
  const parts = tailMd.split(/\n(?=## )/);
  return parts.map((p) => p.trim()).filter(Boolean);
}

function parsePersonaQA(sectionBody) {
  const introMatch = sectionBody.match(/^([\s\S]*?)(?=\n### \d)/);
  let intro = "";
  let rest = sectionBody.trim();
  if (introMatch && introMatch[1].trim()) {
    intro = introMatch[1].trim().replace(/\s+/g, " ");
    rest = sectionBody.slice(introMatch[0].length).trim();
  }
  const groups = [];
  const chunks = rest.split(/\n(?=### )/).filter(Boolean);
  for (const chunk of chunks) {
    const trimmed = chunk.trim().replace(/^###\s+/, "");
    const lines = trimmed.split("\n");
    const heading = lines[0].trim();
    const title = heading.replace(/^\d+\.\d+\s+/, "").trim();
    const items = [];
    for (const line of lines.slice(1)) {
      const m = line.match(/^[-*]\s+\[[ x]\]\s*(.+)/);
      if (m) items.push(m[1].trim());
    }
    groups.push({ title, items });
  }
  return { intro, groups };
}

function parseHelpUrlSection(sectionBody) {
  const lines = sectionBody.split("\n");
  const intro = [];
  const after = [];
  const urlRows = [];
  let i = 0;
  let foundTable = false;

  while (i < lines.length) {
    const t = lines[i].trim();
    if (t.startsWith("|") && t.includes("Constant")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const parsed = parseTableLines(tableLines);
      if (parsed.headers && parsed.rows) {
        const h0 = parsed.headers[0].toLowerCase();
        if (h0.includes("constant")) {
          for (const row of parsed.rows) {
            if (row.length >= 2) {
              const constant = row[0].replace(/`/g, "").trim();
              const pathCell = row[1].replace(/`/g, "").trim();
              const path = pathCell.startsWith("/") ? pathCell : `/${pathCell}`;
              urlRows.push({ constant, path });
            }
          }
        }
      }
      foundTable = true;
      continue;
    }
    if (!t) {
      i++;
      continue;
    }
    if (t === "---") {
      i++;
      continue;
    }
    const lineText = t.replace(/\s+/g, " ");
    if (!foundTable) intro.push(lineText);
    else after.push(lineText);
    i++;
  }
  return {
    intro,
    rows: urlRows,
    legalNote: after.filter((p) => p && p !== "---"),
  };
}

const md = fs.readFileSync(inventoryPath, "utf8").replace(/\r\n/g, "\n");

const prologue = extractPrologue(md);
const features = parseFeatureBlocks(md);
const groups = buildGroups(features);

const tailStart = md.indexOf("## 1. DNS");
if (tailStart === -1) throw new Error("Missing ## 1. DNS");
const tail = md.slice(tailStart);

const rawSections = splitTopLevelSections(tail);
let personaIntro = "";
let personaGroups = [];
let helpUrls = [];
let helpUrlIntro = [];
let legalHelpNote = [];

/** @type {{ id: string; title: string; blocks: object[] }[]} */
const manifestSections = [];

for (const raw of rawSections) {
  const firstNl = raw.indexOf("\n");
  const titleLine = firstNl === -1 ? raw : raw.slice(0, firstNl).trim();
  const body = firstNl === -1 ? "" : raw.slice(firstNl + 1).trim();
  const title = titleLine.replace(/^##\s+/, "").trim();

  if (/^6\./.test(title)) {
    const parsed = parsePersonaQA(body);
    personaIntro = parsed.intro;
    personaGroups = parsed.groups;
    continue;
  }
  if (/^7\./.test(title)) {
    const parsed = parseHelpUrlSection(body);
    helpUrls = parsed.rows;
    helpUrlIntro = parsed.intro;
    legalHelpNote = parsed.legalNote;
    continue;
  }

  if (/^([1-5]\.|8\.|9\.)/.test(title)) {
    manifestSections.push({
      id: "manifest-" + slugify(title),
      title,
      blocks: parseBlocks(body),
    });
  }
}

const guidePath = path.join(adminRoot, "src", "lib", "help-centre-inventory-guide-data.ts");
const manifestPath = path.join(
  adminRoot,
  "src",
  "lib",
  "help-centre-inventory-manifest-data.ts",
);
const appendixPath = path.join(adminRoot, "src", "lib", "help-centre-inventory-appendix.ts");

const guideHeader = `/**
 * AUTO-GENERATED by scripts/generate-inventory-guide-data.mjs — do not edit by hand.
 * Source: PreluraSwift/HELP_CENTRE_FEATURE_INVENTORY.md (Simple feature list).
 */

export type InventoryGuideFeature = {
  id: string;
  title: string;
  why: string;
  steps: string[];
  expect?: string;
  goodToKnow?: string;
};

export type InventoryGuideGroup = {
  title: string;
  items: InventoryGuideFeature[];
};

`;

fs.writeFileSync(
  guidePath,
  guideHeader + `export const INVENTORY_GUIDE_GROUPS: InventoryGuideGroup[] = ${JSON.stringify(groups, null, 2)};\n`,
  "utf8",
);

const manifestHeader = `/**
 * AUTO-GENERATED by scripts/generate-inventory-guide-data.mjs — do not edit by hand.
 * Source: PreluraSwift/HELP_CENTRE_FEATURE_INVENTORY.md (§1–§5, §8, §9).
 */

export type InventoryManifestTableBlock = {
  type: "table";
  headers: string[] | null;
  rows: string[][];
};

export type InventoryManifestBlock =
  | { type: "paragraph"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered"; items: string[] }
  | { type: "code"; text: string }
  | InventoryManifestTableBlock;

export type InventoryManifestSection = {
  id: string;
  title: string;
  blocks: InventoryManifestBlock[];
};

`;

fs.writeFileSync(
  manifestPath,
  manifestHeader +
    `export const INVENTORY_DOC_PROLOGUE: string[] = ${JSON.stringify(prologue, null, 2)};\n\nexport const INVENTORY_MANIFEST_SECTIONS: InventoryManifestSection[] = ${JSON.stringify(manifestSections, null, 2)};\n`,
  "utf8",
);

const appendixHeader = `/**
 * AUTO-GENERATED by scripts/generate-inventory-guide-data.mjs — do not edit by hand.
 * Source: PreluraSwift/HELP_CENTRE_FEATURE_INVENTORY.md (§6–§7).
 */

`;

fs.writeFileSync(
  appendixPath,
  appendixHeader +
    `export const IN_APP_HELP_INTRO: string[] = ${JSON.stringify(helpUrlIntro, null, 2)};\n\nexport const IN_APP_HELP_URL_ROWS: { constant: string; path: string }[] = ${JSON.stringify(helpUrls, null, 2)};\n\nexport const IN_APP_HELP_LEGAL_NOTE: string[] = ${JSON.stringify(legalHelpNote, null, 2)};\n\nexport const PERSONA_QA_INTRO: string = ${JSON.stringify(personaIntro)};\n\nexport const PERSONA_QA_GROUPS: { title: string; items: string[] }[] = ${JSON.stringify(personaGroups, null, 2)};\n`,
  "utf8",
);

console.log(
  "Wrote guide:",
  guidePath,
  "groups:",
  groups.length,
  "features:",
  features.length,
);
console.log("Wrote manifest:", manifestPath, "sections:", manifestSections.length);
console.log(
  "Wrote appendix:",
  appendixPath,
  "urls:",
  helpUrls.length,
  "persona groups:",
  personaGroups.length,
);
