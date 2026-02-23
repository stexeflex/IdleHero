// Icon files generator
// Scans src/assets subfolders for .svg and writes corresponding
// src/shared/components/icon/*.icons.ts files.

const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");
const assetsRoot = path.join(workspaceRoot, "src", "assets");

/**
 * Map asset folder -> output file and identifiers
 */
const ICON_CONFIGS = [
  {
    folder: "characters",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "characters.icons.ts"),
    typeName: "CharactersIconName",
    constName: "CHARACTERS_ICONS"
  },
  {
    folder: "creatures",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "creatures.icons.ts"),
    typeName: "CreaturesIconName",
    constName: "CREATURES_ICONS"
  },
  {
    folder: "combat",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "combat.icons.ts"),
    typeName: "CombatIconName",
    constName: "COMBAT_ICONS"
  },
  {
    folder: "gear",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "gear-slot.icons.ts"),
    typeName: "GearSlotIconName",
    constName: "GEAR_SLOT_ICONS"
  },
  {
    folder: "symbols",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "symbols.icons.ts"),
    typeName: "SymbolsIconName",
    constName: "SYMBOLS_ICONS"
  },
  {
    folder: "ui",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "ui.icons.ts"),
    typeName: "UiIconName",
    constName: "UI_ICONS"
  },
  {
    folder: "places",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "places.icons.ts"),
    typeName: "PlacesIconName",
    constName: "PLACES_ICONS"
  },
  {
    folder: "skills",
    outFile: path.join(workspaceRoot, "src", "shared", "components", "icon", "skills.icons.ts"),
    typeName: "SkillsIconName",
    constName: "SKILLS_ICONS"
  }
];

function sanitizeName(filename) {
  // Keep letters only, lowercased
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^A-Za-z]+/g, "")
    .toLowerCase();
}

function extractPathMarkup(svgText) {
  // Collect both self-closing <path .../> and explicit </path> blocks
  const selfClosing = svgText.match(/<path\b[^>]*\/>/gi) || [];
  const closed = svgText.match(/<path\b[^>]*>[\s\S]*?<\/path>/gi) || [];
  const sanitize = (tag) =>
    tag
      // remove inline style attribute entirely
      .replace(/\sstyle="[^"]*"/gi, "")
      .replace(/\sstyle='[^']*'/gi, "")
      // strip fill-related attributes to honor parent svg fill
      .replace(/\sfill="[^"]*"/gi, "")
      .replace(/\sfill='[^']*'/gi, "")
      .replace(/\sfill-opacity="[^"]*"/gi, "")
      .replace(/\sfill-opacity='[^']*'/gi, "")
      // strip stroke to avoid unexpected outlines unless authored intentionally
      .replace(/\sstroke="[^"]*"/gi, "")
      .replace(/\sstroke='[^']*'/gi, "");
  return selfClosing.concat(closed).map(sanitize).join("");
}

function escapeSingleQuotes(str) {
  return str.replace(/'/g, "\\'");
}

function readSvgFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".svg"))
    .map((d) => path.join(d.parentPath, d.name));

  console.log(`[icons] Found ${files.length} SVG files in ${dir}`);
  return files;
}

function generateFileContent(typeName, constName, entries) {
  const namesUnion = entries.map((e) => `'${e.name}'`).join(" | ");
  const lines = [];
  lines.push(`export type ${typeName} = ${namesUnion};`);
  lines.push("");
  lines.push(`export const ${constName}: Record<${typeName}, string> = {`);
  entries.forEach((e, idx) => {
    const comma = idx < entries.length - 1 ? "," : "";
    lines.push(`  ${e.name}: '${escapeSingleQuotes(e.content)}'${comma}`);
  });
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function generateForConfig(cfg) {
  const srcDir = path.join(assetsRoot, cfg.folder);
  const svgFiles = readSvgFiles(srcDir);

  if (svgFiles.length === 0) {
    console.warn(`[icons] No SVG files found in ${srcDir}`);
  }

  const seen = new Set();
  const entries = [];

  for (const file of svgFiles) {
    const name = sanitizeName(path.basename(file));

    if (!name) {
      console.warn(`[icons] Skipping ${file}: sanitized name is empty`);
      continue;
    }

    if (seen.has(name)) {
      console.warn(`[icons] Duplicate key '${name}' in ${srcDir}, skipping ${file}`);
      continue;
    }

    const svgText = fs.readFileSync(file, "utf8");
    const pathMarkup = extractPathMarkup(svgText).trim();

    if (!pathMarkup) {
      console.warn(`[icons] No <path> content in ${file}, skipping`);
      continue;
    }

    seen.add(name);
    entries.push({ name, content: pathMarkup });
  }

  // Sort entries by name for a stable output
  entries.sort((a, b) => a.name.localeCompare(b.name));

  const content = generateFileContent(cfg.typeName, cfg.constName, entries);
  ensureDirForFile(cfg.outFile);
  fs.writeFileSync(cfg.outFile, content, "utf8");
  console.log(`[icons] Wrote ${cfg.outFile} (${entries.length} icons)`);
}

function main() {
  console.log("[icons] Generating icon maps from assets...");
  ICON_CONFIGS.forEach(generateForConfig);
  console.log("[icons] Done.");
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("[icons] Failed:", err);
    process.exit(1);
  }
}
