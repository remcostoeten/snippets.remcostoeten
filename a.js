  #!/usr/bin/env node
  const fs = require("fs");
  const path = require("path");

  // Allowed components
  const components = [
    "badge",
    "button",
    "card",
    "code-theme-switcher",
    "dropdown-menu",
    "input",
    "label",
    "post-metadata",
    "separator",
    "tabs",
    "theme-switcher",
    "tooltip",
  ];

  // Recursively get all .tsx files
  function getTSXFiles(dir, files = []) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        getTSXFiles(fullPath, files);
      } else if (entry.isFile() && fullPath.endsWith(".tsx")) {
        files.push(fullPath);
      }
    });
    return files;
  }

  function processFile(filePath) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Regex to match allowed UI imports
    const importRegex = new RegExp(
      `import\\s+(\\{[^}]+\\}|[\\w]+)\\s+from\\s+['"](.*/ui/(${components.join(
        "|"
      )})(\\.tsx)?)['"];?`,
      "g"
    );

    let uiImports = [];
    content = content.replace(importRegex, (match, imports) => {
      // Normalize imports into array
      imports = imports.replace(/[{}]/g, "").split(",").map((i) => i.trim());
      uiImports.push(...imports);
      return ""; // remove original import
    });

    if (uiImports.length > 0) {
      // Remove empty lines left behind
      content = content.replace(/^\s*\n/gm, "");

      // Prepare combined UI import block with trailing commas
      const uiImportBlock = `import {\n    ${uiImports.join(",\n    ")},\n} from "ui";\n`;

      // Insert after last non-UI import (or after 'use client' if present)
      const lines = content.split("\n");
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          line.startsWith("import") &&
          !line.includes('"ui"') &&
          line.trim() !== ""
        ) {
          insertIndex = i + 1;
        }
      }

      lines.splice(insertIndex, 0, "", uiImportBlock); // add an empty line before import
      content = lines.join("\n");
    }

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Updated ${filePath}`);
  }

  // Run script
  const tsxFiles = getTSXFiles(process.cwd());
  tsxFiles.forEach(processFile);

