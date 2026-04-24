import { test, expect } from "@playwright/test";

// Helper to log in as a user
async function login(page, username, password) {
  await page.goto("/login");
  await page.waitForSelector("#username", { timeout: 10000 });
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  // Wait for redirect to questions page
  await page.waitForURL("/", { timeout: 15000 });
}

test.describe("Full Stack Smoke Tests", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#username")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#password")).toBeVisible();
    // Should have Sign In button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("can log in as admin", async ({ page }) => {
    await login(page, "admin", "admin");
    // Should see Questions nav link
    await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
    // Admin user should see their username in header
    await expect(page.locator("header")).toContainText("admin");
  });

  test("questions page shows seeded questions", async ({ page }) => {
    await login(page, "admin", "admin");
    // Should see at least some question titles from seed data
    await expect(
      page.locator("text=Best practices for React state management")
    ).toBeVisible({ timeout: 15000 });
  });

  test("can navigate to question detail", async ({ page }) => {
    await login(page, "admin", "admin");
    // Click on a question link
    await page.click("text=Best practices for React state management");
    // Should see answer form heading on detail page
    await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });
  });

  test("can post an answer to a question", async ({ page }) => {
    await login(page, "admin", "admin");
    // Go to a question
    await page.click("text=Best practices for React state management");
    await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });

    // Type an answer
    const answerText = "E2E test answer - use React Query for server state.";
    await page.fill('textarea[placeholder="Write your answer here..."]', answerText);
    await page.click('button:has-text("Post Your Answer")');

    // Answer should appear on the page
    await expect(page.locator(`text=${answerText}`)).toBeVisible({ timeout: 10000 });
  });

  test("can navigate to Ask page and see form", async ({ page }) => {
    await login(page, "admin", "admin");
    await page.click('a:has-text("Ask")');
    await expect(page.locator("text=Ask a Question")).toBeVisible({ timeout: 10000 });
  });

  test("admin can see SQL Console nav link", async ({ page }) => {
    await login(page, "admin", "admin");
    await expect(page.locator('a:has-text("SQL Console")')).toBeVisible({ timeout: 10000 });
  });

  test("SQL Console page loads and executes query", async ({ page }) => {
    await login(page, "admin", "admin");
    await page.click('a:has-text("SQL Console")');
    await expect(page.locator("h1:has-text('SQL Console')")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("textarea#sql")).toBeVisible();

    // Execute a simple query
    await page.fill("textarea#sql", "SELECT COUNT(*) as cnt FROM auth_user");
    await page.click('button:has-text("Execute")');

    // Should see results table with count
    await expect(page.locator("th:has-text('cnt')")).toBeVisible({ timeout: 10000 });
  });

  test("non-admin user cannot see SQL Console link", async ({ page }) => {
    await login(page, "demo", "demo1234");
    // Should NOT see SQL Console
    await expect(page.locator('a:has-text("SQL Console")')).toHaveCount(0);
    // Should still see Questions nav
    await expect(page.locator('a:has-text("Questions")')).toBeVisible();
  });

  test("category sidebar is visible on questions page", async ({ page }) => {
    await login(page, "admin", "admin");
    // Should see a category button in the sidebar
    await expect(page.locator('button:has-text("Customer")')).toBeVisible({ timeout: 15000 });
  });
});
