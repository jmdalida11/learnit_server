export const plugins = ["import"];
export const rules = {
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
    },
  ],
};
