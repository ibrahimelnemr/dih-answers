# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.js >> Full User Flow >> SQL console executes queries for admin
- Location: e2e/smoke.spec.js:229:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#username') to be visible

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "DIH Champions" [level=1] [ref=e6]
    - paragraph [ref=e7]: Internal knowledge platform
  - generic [ref=e8]:
    - heading "Services are starting up..." [level=2] [ref=e11]
    - paragraph [ref=e12]: Free-tier services may be asleep. Wake them up, then retry.
    - generic [ref=e13]:
      - link "Wake Up Backend ↗" [ref=e14] [cursor=pointer]:
        - /url: https://dih-answers-backend.onrender.com/health
      - link "Wake Up Mailpit ↗" [ref=e15] [cursor=pointer]:
        - /url: https://mailpit-o5ht.onrender.com/
      - button "Retry Connection" [ref=e16]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | // Helper to log in as a user
  4   | async function login(page, username, password) {
  5   |   await page.goto("/login");
> 6   |   await page.waitForSelector("#username", { timeout: 15000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  7   |   await page.fill("#username", username);
  8   |   await page.fill("#password", password);
  9   |   await page.click('button[type="submit"]');
  10  |   // Wait for redirect to home
  11  |   await page.waitForURL("/", { timeout: 20000 });
  12  | }
  13  | 
  14  | // Helper to open the user dropdown menu in the header
  15  | async function openUserDropdown(page) {
  16  |   // Click the user icon button (the last button with an SVG in the header)
  17  |   const userBtn = page.locator("header button").last();
  18  |   await userBtn.click();
  19  |   // Wait for dropdown animation
  20  |   await page.waitForTimeout(300);
  21  | }
  22  | 
  23  | test.describe("Smoke Tests", () => {
  24  |   test("login page loads", async ({ page }) => {
  25  |     await page.goto("/login");
  26  |     await expect(page.locator("#username")).toBeVisible({ timeout: 15000 });
  27  |     await expect(page.locator("#password")).toBeVisible();
  28  |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  29  |   });
  30  | 
  31  |   test("can log in as admin", async ({ page }) => {
  32  |     await login(page, "admin", "admin");
  33  |     await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
  34  |     await expect(page.locator("header")).toContainText("admin");
  35  |   });
  36  | 
  37  |   test("can log in as demo user", async ({ page }) => {
  38  |     await login(page, "demo", "demo1234");
  39  |     await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
  40  |   });
  41  | 
  42  |   test("home page shows categories and leaderboard", async ({ page }) => {
  43  |     await login(page, "demo", "demo1234");
  44  |     await expect(page.locator("text=Explore Categories")).toBeVisible({ timeout: 10000 });
  45  |     await expect(page.locator("text=Leaderboard")).toBeVisible();
  46  |   });
  47  | 
  48  |   test("questions page loads with seeded questions", async ({ page }) => {
  49  |     await login(page, "demo", "demo1234");
  50  |     await page.click('a:has-text("Questions")');
  51  |     await expect(page.locator("h1:has-text('Questions')")).toBeVisible({ timeout: 10000 });
  52  |     await expect(page.locator("text=How does the company handle work-life balance?")).toBeVisible({ timeout: 15000 });
  53  |   });
  54  | 
  55  |   test("can navigate to question detail", async ({ page }) => {
  56  |     await login(page, "demo", "demo1234");
  57  |     await page.click('a:has-text("Questions")');
  58  |     await page.click("text=How does the company handle work-life balance?");
  59  |     await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });
  60  |   });
  61  | 
  62  |   test("can navigate to Ask page", async ({ page }) => {
  63  |     await login(page, "demo", "demo1234");
  64  |     await page.click('a:has-text("Ask")');
  65  |     await expect(page.locator("h1:has-text('Ask a Question')")).toBeVisible({ timeout: 10000 });
  66  |   });
  67  | 
  68  |   test("dark mode toggle works", async ({ page }) => {
  69  |     await login(page, "demo", "demo1234");
  70  |     // Find the theme toggle button (first button in header - contains sun/moon)
  71  |     const themeBtn = page.locator("header button").first();
  72  |     await themeBtn.click();
  73  |     await expect(page.locator("html")).toHaveClass(/dark/);
  74  |     await themeBtn.click();
  75  |     await expect(page.locator("html")).not.toHaveClass(/dark/);
  76  |   });
  77  | 
  78  |   test("user dropdown shows profile options", async ({ page }) => {
  79  |     await login(page, "admin", "admin");
  80  |     await openUserDropdown(page);
  81  |     await expect(page.locator("text=Settings")).toBeVisible();
  82  |     await expect(page.locator("text=View Profile")).toBeVisible();
  83  |     await expect(page.locator("text=Sign Out")).toBeVisible();
  84  |   });
  85  | 
  86  |   test("admin sees SQL Console in dropdown", async ({ page }) => {
  87  |     await login(page, "admin", "admin");
  88  |     await openUserDropdown(page);
  89  |     await expect(page.locator("text=SQL Console")).toBeVisible();
  90  |   });
  91  | 
  92  |   test("non-admin does NOT see SQL Console in dropdown", async ({ page }) => {
  93  |     await login(page, "demo", "demo1234");
  94  |     await openUserDropdown(page);
  95  |     await expect(page.locator("text=SQL Console")).toHaveCount(0);
  96  |   });
  97  | 
  98  |   test("settings page loads", async ({ page }) => {
  99  |     await login(page, "demo", "demo1234");
  100 |     await openUserDropdown(page);
  101 |     await page.click("text=Settings");
  102 |     await expect(page.locator("h1:has-text('Settings')")).toBeVisible({ timeout: 10000 });
  103 |     await expect(page.locator("text=Profile Information")).toBeVisible();
  104 |     await expect(page.locator("text=Patron Topics")).toBeVisible();
  105 |   });
  106 | 
```