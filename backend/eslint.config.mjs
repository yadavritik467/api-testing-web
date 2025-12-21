<<<<<<< HEAD
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
=======
import js from "@eslint/js";
import tseslint from "typescript-eslint";
>>>>>>> 2f6a592 (added eslint in backend)

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
<<<<<<< HEAD
        project: './tsconfig.json',
=======
        project: "./tsconfig.json", 
>>>>>>> 2f6a592 (added eslint in backend)
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
<<<<<<< HEAD
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'eslint.config.mjs'],
  }
)
=======
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error", 
      "no-console": "warn",
    },
  },
  {
    ignores: ["dist/", "node_modules/","eslint.config.mjs"], 
  }
);
>>>>>>> 2f6a592 (added eslint in backend)
