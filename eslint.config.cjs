// eslint.config.cjs
const js = require("@eslint/js");
const next = require("eslint-config-next");

module.exports = [
  js(),
  ...next(),
  {
    ignores: [
      "node_modules",
      ".next",
      "dist",
      "build",
      "out",
      "schema"
    ],
  },
];