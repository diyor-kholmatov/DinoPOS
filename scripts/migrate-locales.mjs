import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const sourceDirectory = path.resolve("js/locales");
const destinationDirectory = path.resolve("src/i18n/locales");

await fs.mkdir(destinationDirectory, { recursive: true });

for (const locale of ["en", "ru", "uz"]) {
  const source = await fs.readFile(path.join(sourceDirectory, `${locale}.js`), "utf8");
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context, { filename: `${locale}.js` });
  const dictionary = context.window.NOVA_LOCALES?.[locale];

  if (!dictionary || typeof dictionary !== "object") {
    throw new Error(`Could not extract legacy locale: ${locale}`);
  }

  await fs.writeFile(
    path.join(destinationDirectory, `${locale}.json`),
    `${JSON.stringify(dictionary, null, 2)}\n`,
  );
}

