/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require("@plasmohq/prettier-plugin-sort-imports")],
  importOrder: ["^@plasmohq/(.*)$", "^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 100,
};
