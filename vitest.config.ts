import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    mockReset: true
    // setupFiles: './tests/utils/setup.js'
  }
})
