import { copyFile, readFile, writeFile } from "node:fs/promises";

await copyFile("dist/index.html", "dist/404.html");
await writeFile("dist/.nojekyll", "", "utf8");

const index = await readFile("dist/index.html", "utf8");
const legacyRoutes = {
  "dashboard.html": "dashboard",
  "checkout.html": "checkout",
  "catalog.html": "catalog",
  "inventory.html": "inventory",
  "customers.html": "customers",
  "reports.html": "reports",
  "settings.html": "settings",
};

await Promise.all(Object.entries(legacyRoutes).map(([file, route]) => {
  const redirect = index.replace(
    "</head>",
    `<script>if(location.pathname.endsWith('.html'))location.replace(location.pathname.replace(/[^/]+$/, '${route}') + location.search + location.hash)</script></head>`,
  );
  return writeFile(`dist/${file}`, redirect, "utf8");
}));
