/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [
    require("@plasmohq/prettier-plugin-sort-imports"),
    require("prettier-plugin-tailwindcss"),
  ],
  importOrder: ["^@plasmohq/(.*)$", "^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 100,
  singleAttributePerLine: true,
};
