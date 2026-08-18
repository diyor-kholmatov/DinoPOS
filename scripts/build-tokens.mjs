import StyleDictionary from "style-dictionary";

const commonSources = [
  "tokens/primitive.json",
  "tokens/semantic.json",
  "tokens/component.json",
];

for (const theme of ["light", "dark"]) {
  const selector = theme === "light"
    ? ':root, [data-theme="light"]'
    : '[data-theme="dark"]';

  const dictionary = new StyleDictionary({
    source: [...commonSources, `tokens/themes/${theme}.json`],
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: "src/styles/generated/",
        files: [
          {
            destination: `${theme}.css`,
            format: "css/variables",
            options: {
              outputReferences: true,
              selector,
            },
          },
        ],
      },
    },
  });

  await dictionary.buildAllPlatforms();
}

