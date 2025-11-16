# React + TypeScript + Vite Template

A minimal setup for **React** with **TypeScript** in **Vite**, featuring HMR (Hot Module Replacement) and recommended ESLint rules.

---

## 🚀 Features

- **React 18** with **TypeScript**
- **Vite** for fast builds and HMR
- Preconfigured **ESLint** rules
- Optional **React Compiler** support
- Recommended **React lint plugins** (`eslint-plugin-react-x`, `eslint-plugin-react-dom`)

---

## ⚡ Available Plugins

You can choose one of the official Vite plugins for React:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)**  
  Uses **Babel** for Fast Refresh

- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)**  
  Uses **SWC** for Fast Refresh (faster builds)

---

## 🛠 React Compiler

The **React Compiler** is not enabled by default to avoid dev/build performance issues.  
To enable it, follow the [official documentation](https://react.dev/learn/react-compiler/installation).

---

## 🧹 Expanding ESLint Configuration

For production-level apps, enable type-aware lint rules:

```ts
import { defineConfig, globalIgnores } from '@eslint/js'
import tseslint from '@eslint/js-ts'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Recommended type-checked rules
      tseslint.configs.recommendedTypeChecked,

      // Stricter rules (optional)
      tseslint.configs.strictTypeChecked,

      // Stylistic rules (optional)
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
