import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const sourceRoot = "apps/web/src";
const errors = [];
const moduleDependencies = new Map();

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(file);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    await inspect(file);
  }
}

async function inspect(file) {
  const normalized = file.split(sep).join("/");
  const source = await readFile(file, "utf8");
  const moduleOwner = normalized.match(/\/modules\/([^/]+)\//)?.[1];
  const imports = [...source.matchAll(/(?:from\s+|import\s*\()(["'])([^"']+)\1/g)]
    .map((match) => match[2]);
  const runtimeImports = collectRuntimeImports(source, file);
  const isTest = /\.test\.(ts|tsx)$/.test(file);

  for (const dependency of imports) {
    if (!dependency) continue;
    if (normalized.includes("/shared/") && !normalized.includes("/shared/legacy/")) {
      if (dependency.startsWith("@/modules/") || dependency.startsWith("@/pages/") || dependency.startsWith("@/app/")) {
        errors.push(`${relative(".", file)}: shared code cannot import ${dependency}`);
      }
    }
    if (moduleOwner) {
      if (dependency.startsWith("@/pages/") || dependency.startsWith("@/app/")) {
        errors.push(`${relative(".", file)}: module code cannot import ${dependency}`);
      }
      const importedModule = dependency.match(/^@\/modules\/([^/]+)(\/.*)?$/);
      if (!isTest && runtimeImports.has(dependency) && importedModule?.[1] && importedModule[1] !== moduleOwner) {
        const dependencies = moduleDependencies.get(moduleOwner) ?? new Set();
        dependencies.add(importedModule[1]);
        moduleDependencies.set(moduleOwner, dependencies);
      }
      if (importedModule?.[1] !== moduleOwner && importedModule?.[2] && importedModule[2] !== "/model") {
        errors.push(`${relative(".", file)}: cross-module imports must use @/modules/${importedModule?.[1]}/model`);
      }
    }
    if (normalized.includes("/app/") && /^@\/modules\/[^/]+\/(?!model$)/.test(dependency)) {
      errors.push(`${relative(".", file)}: app code must use a module public entry point (${dependency})`);
    }
  }

  if (!isTest && !normalized.endsWith("/shared/persistence/storage.ts") && source.includes("localStorage")) {
    errors.push(`${relative(".", file)}: direct localStorage access must use shared/persistence/storage`);
  }
}

function collectRuntimeImports(source, file) {
  const imports = new Set();
  for (const match of source.matchAll(/import\s+([\s\S]*?)\s+from\s+["']([^"']+)["']/g)) {
    const clause = match[1]?.trim() ?? "";
    const dependency = match[2];
    if (!dependency || clause.startsWith("type ")) continue;
    const namedOnly = clause.startsWith("{") && clause.endsWith("}");
    const bindings = namedOnly
      ? clause.slice(1, -1).split(",").map((binding) => binding.trim()).filter(Boolean)
      : [];
    if (!namedOnly || bindings.some((binding) => !binding.startsWith("type "))) {
      imports.add(dependency);
    }
  }
  for (const match of source.matchAll(/(?:^|\n)\s*import\s*["']([^"']+)["']/g)) {
    if (match[1]) imports.add(match[1]);
  }
  for (const match of source.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    if (match[1]) imports.add(match[1]);
  }
  for (const match of source.matchAll(/export\s+(?!type\b)[\s\S]*?\s+from\s+["']([^"']+)["']/g)) {
    if (match[1]) imports.add(match[1]);
  }
  return imports;
}

function findModuleCycles() {
  const visiting = new Set();
  const visited = new Set();
  const path = [];

  function visitModule(moduleName) {
    if (visiting.has(moduleName)) {
      const cycleStart = path.indexOf(moduleName);
      errors.push(`Circular module dependency: ${[...path.slice(cycleStart), moduleName].join(" -> ")}`);
      return;
    }
    if (visited.has(moduleName)) return;

    visiting.add(moduleName);
    path.push(moduleName);
    for (const dependency of moduleDependencies.get(moduleName) ?? []) {
      visitModule(dependency);
    }
    path.pop();
    visiting.delete(moduleName);
    visited.add(moduleName);
  }

  for (const moduleName of moduleDependencies.keys()) {
    visitModule(moduleName);
  }
}

await visit(sourceRoot);
findModuleCycles();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Frontend dependency boundaries are valid.");
}
