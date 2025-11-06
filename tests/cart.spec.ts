import { test, expect, type Page } from '@playwright/test';

const USER = 'standard_user';
const PASS = 'secret_sauce';

async function login(page: Page) {
  // use baseURL from config by navigating to '/'
  await page.goto('/');
  await page.context().clearCookies();
  try { await page.evaluate(() => localStorage.clear()); } catch { /* ignore security errors */ }

  const username = page.locator('#user-name');
  const password = page.locator('#password');
  const loginButton = page.locator('#login-button');

  await expect(username).toBeVisible();
  await username.fill(USER);
  await password.fill(PASS);
  await Promise.all([
    loginButton.click(),
    page.waitForURL(/\/inventory\.html/, { timeout: 15000 }),
  ]);
  await page.waitForLoadState('networkidle');
}

test.describe('Cart flows for Sauce Labs Backpack', () => {
  test('adds Sauce Labs Backpack to cart', async ({ page }) => {
    await login(page);

    const addBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
    await expect(addBackpack).toBeVisible();
    await addBackpack.click();

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL(/\/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('removes Sauce Labs Backpack from cart', async ({ page }) => {
    await login(page);

    // add first so removal is idempotent
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // go to cart and remove
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL(/\/cart\.html/);
    const removeBtn = page.locator('#remove-sauce-labs-backpack');
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    // cart badge should disappear (count 0)
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveCount(0);
    // item should no longer be visible in cart
    await expect(page.getByText('Sauce Labs Backpack')).toHaveCount(0);
  });

  test('completes checkout for Sauce Labs Backpack', async ({ page }) => {
    await login(page);

    // add item and go to cart
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL(/\/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // checkout flow
    await page.locator('#checkout').click();
    await page.waitForURL(/\/checkout-step-one\.html/);
    await page.locator('#first-name').fill('Test');
    await page.locator('#last-name').fill('User');
    await page.locator('#postal-code').fill('12345');
    await Promise.all([
      page.locator('#continue').click(),
      page.waitForURL(/\/checkout-step-two\.html/),
    ]);

    // finish
    await page.locator('#finish').click();
    await page.waitForURL(/\/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    // final sanity: login button should be accessible from menu after finishing (not required)
  });
});