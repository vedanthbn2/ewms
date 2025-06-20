import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.js',
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:3000',
  },
});
