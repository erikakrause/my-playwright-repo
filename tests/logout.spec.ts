import { test, expect, type Page } from '@playwright/test';

const BASE = 'https://www.saucedemo.com/';
const USER = 'standard_user';
const PASS = 'secret_sauce';

async function login(page: Page) {
  await page.goto(BASE);
  await page.context().clearCookies();
  try { await page.evaluate(() => localStorage.clear()); } catch { /* ignore security errors */ }

  const username = page.locator('#user-name');
  const password = page.locator('#password');
  const loginButton = page.locator('#login-button');

  await expect(username).toBeVisible({ timeout: 10000 });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });

  await username.fill(USER);
  await password.fill(PASS);
  await loginButton.click();

  await page.waitForURL(/\/inventory\.html/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test('logout after successful login returns to https://www.saucedemo.com/', async ({ page }) => {
  await login(page);

  // ensure we're on inventory page (wait for URL and assert heading using case-insensitive match)
  await page.waitForURL(/\/inventory\.html/, { timeout: 15000 });
  await expect(page.locator('.title')).toHaveText(/Products/i, { timeout: 15000 });


  // open menu and click logout
  const menuButton = page.locator('#react-burger-menu-btn');
  const logoutLink = page.locator('#logout_sidebar_link');

  await menuButton.click();
  await expect(logoutLink).toBeVisible({ timeout: 5000 });
  await logoutLink.click();

  // verify redirected to the public root (accept '/' or '/index.html')
  await page.waitForURL(/\/(?:index\.html)?$/, { timeout: 10000 });
  await expect(page.locator('#login-button')).toBeVisible({ timeout: 10000 });
});