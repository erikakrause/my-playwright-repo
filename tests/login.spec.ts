import { test, expect } from '@playwright/test';

const USER = 'standard_user';
const PASS = 'secret_sauce';

test.describe('SauceDemo auth flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.context().clearCookies();
    try { await page.evaluate(() => localStorage.clear()); } catch { /* ignore security errors */ }
  });

  test('login with valid credentials shows Products and allows logout', async ({ page }) => {
    const username = page.locator('#user-name');
    const password = page.locator('#password');
    const loginButton = page.locator('#login-button');

    await expect(username).toBeVisible({ timeout: 10000 });
    await expect(loginButton).toBeEnabled({ timeout: 10000 });

    await username.fill(USER);
    await password.fill(PASS);

    await loginButton.click();
    // wait for URL and for network to settle to ensure page has fully loaded
    await page.waitForURL(/\/inventory\.html/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    const inventory = page.locator('[data-test="inventory-container"]').first();
    await expect(inventory).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.title')).toHaveText(/products/i, { timeout: 5000 });

    const menuButton = page.locator('#react-burger-menu-btn');
    await menuButton.click();
    const logoutLink = page.locator('#logout_sidebar_link');
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
    await logoutLink.click();

    await expect(loginButton).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/(?:index\.html)?$/);
  });

  test('shows error with invalid credentials', async ({ page }) => {
    const username = page.locator('#user-name');
    const password = page.locator('#password');
    const loginButton = page.locator('#login-button');

    await expect(username).toBeVisible({ timeout: 10000 });

    await username.fill('standard_invalid');
    await password.fill('123456');

    await loginButton.click();

    const error = page.locator('.error-message-container');
    await expect(error).toBeVisible({ timeout: 15000 });

    // assert the exact SauceDemo error message for invalid credentials
    await expect(error).toContainText('Epic sadface: Username and password do not match any user in this service', { timeout: 15000 });

    // reset state for idempotence
    const closeBtn = error.locator('button');
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await expect(error).toBeVisible({ timeout: 5000 });
    } else {
      await page.reload();
    }
  });
});