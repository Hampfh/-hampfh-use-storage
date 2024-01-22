/// <reference types="vitest" />
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json-summary", "json"],
      exclude: ["node_modules/**", "examples/**", "lib/**"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      $: path.resolve(__dirname, "./tests/")
    }
  }
})
