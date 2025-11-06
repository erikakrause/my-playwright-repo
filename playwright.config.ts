import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 15000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'https://www.saucedemo.com',
    actionTimeout: 10000,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chrome',
      use: { channel: 'chrome', headless: true }
    },
    {
      name: 'chromium',
      use: { browserName: 'chromium', headless: true }
    }
  ]
});
