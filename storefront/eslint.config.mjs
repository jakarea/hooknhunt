import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow some type flexibility for API error handling
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused variables in some cases
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow React unescaped entities as warnings
      "react/no-unescaped-entities": "warn",
      // Allow missing dependencies in useEffect as warnings
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
