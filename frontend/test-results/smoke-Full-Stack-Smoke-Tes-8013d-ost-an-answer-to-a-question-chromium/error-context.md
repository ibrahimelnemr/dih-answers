# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.js >> Full Stack Smoke Tests >> can post an answer to a question
- Location: e2e/smoke.spec.js:54:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "DIH Champions" [level=1] [ref=e6]
    - paragraph [ref=e7]: Internal knowledge platform
  - generic [ref=e8]:
    - generic [ref=e9]:
      - button "Sign In" [ref=e10]
      - button "Sign Up" [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - generic [ref=e14]: Username
        - textbox "Username" [ref=e15]:
          - /placeholder: Enter username
          - text: admin
      - generic [ref=e16]:
        - generic [ref=e17]: Password
        - textbox "Password" [ref=e18]:
          - /placeholder: Enter password
          - text: admin
      - paragraph [ref=e19]: Invalid username or password.
      - button "Sign In" [ref=e20]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | // Helper to log in as a user
  4   | async function login(page, username, password) {
  5   |   await page.goto("/login");
  6   |   await page.waitForSelector("#username", { timeout: 10000 });
  7   |   await page.fill("#username", username);
  8   |   await page.fill("#password", password);
  9   |   await page.click('button[type="submit"]');
  10  |   // Wait for redirect to questions page
> 11  |   await page.waitForURL("/", { timeout: 15000 });
      |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  12  | }
  13  | 
  14  | test.describe("Full Stack Smoke Tests", () => {
  15  |   test("health endpoint returns ok", async ({ request }) => {
  16  |     const response = await request.get("/health");
  17  |     expect(response.ok()).toBeTruthy();
  18  |     const body = await response.json();
  19  |     expect(body.status).toBe("ok");
  20  |   });
  21  | 
  22  |   test("login page loads", async ({ page }) => {
  23  |     await page.goto("/login");
  24  |     await expect(page.locator("#username")).toBeVisible({ timeout: 10000 });
  25  |     await expect(page.locator("#password")).toBeVisible();
  26  |     // Should have Sign In button
  27  |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  28  |   });
  29  | 
  30  |   test("can log in as admin", async ({ page }) => {
  31  |     await login(page, "demo", "demo1234");
  32  |     // Should see Questions nav link
  33  |     await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
  34  |     // Admin user should see their username in header
  35  |     await expect(page.locator("header")).toContainText("demo");
  36  |   });
  37  | 
  38  |   test("questions page shows seeded questions", async ({ page }) => {
  39  |     await login(page, "demo", "demo1234");
  40  |     // Should see at least some question titles from seed data
  41  |     await expect(
  42  |       page.locator("text=How does the company handle work-life balance?")
  43  |     ).toBeVisible({ timeout: 15000 });
  44  |   });
  45  | 
  46  |   test("can navigate to question detail", async ({ page }) => {
  47  |     await login(page, "demo", "demo1234");
  48  |     // Click on a question link
  49  |     await page.click("text=How does the company handle work-life balance?");
  50  |     // Should see answer form heading on detail page
  51  |     await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });
  52  |   });
  53  | 
  54  |   test("can post an answer to a question", async ({ page }) => {
  55  |     await login(page, "admin", "admin");
  56  |     // Go to a question
  57  |     await page.click("text=Best practices for React state management");
  58  |     await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });
  59  | 
  60  |     // Type an answer
  61  |     const answerText = "E2E test answer - use React Query for server state.";
  62  |     await page.fill('textarea[placeholder="Write your answer here..."]', answerText);
  63  |     await page.click('button:has-text("Post Your Answer")');
  64  | 
  65  |     // Answer should appear on the page
  66  |     await expect(page.locator(`text=${answerText}`)).toBeVisible({ timeout: 10000 });
  67  |   });
  68  | 
  69  |   test("can navigate to Ask page and see form", async ({ page }) => {
  70  |     await login(page, "admin", "admin");
  71  |     await page.click('a:has-text("Ask")');
  72  |     await expect(page.locator("text=Ask a Question")).toBeVisible({ timeout: 10000 });
  73  |   });
  74  | 
  75  |   test("admin can see SQL Console nav link", async ({ page }) => {
  76  |     await login(page, "admin", "admin");
  77  |     await expect(page.locator('a:has-text("SQL Console")')).toBeVisible({ timeout: 10000 });
  78  |   });
  79  | 
  80  |   test("SQL Console page loads and executes query", async ({ page }) => {
  81  |     await login(page, "admin", "admin");
  82  |     await page.click('a:has-text("SQL Console")');
  83  |     await expect(page.locator("h1:has-text('SQL Console')")).toBeVisible({ timeout: 10000 });
  84  |     await expect(page.locator("textarea#sql")).toBeVisible();
  85  | 
  86  |     // Execute a simple query
  87  |     await page.fill("textarea#sql", "SELECT COUNT(*) as cnt FROM auth_user");
  88  |     await page.click('button:has-text("Execute")');
  89  | 
  90  |     // Should see results table with count
  91  |     await expect(page.locator("th:has-text('cnt')")).toBeVisible({ timeout: 10000 });
  92  |   });
  93  | 
  94  |   test("non-admin user cannot see SQL Console link", async ({ page }) => {
  95  |     await login(page, "demo", "demo1234");
  96  |     // Should NOT see SQL Console
  97  |     await expect(page.locator('a:has-text("SQL Console")')).toHaveCount(0);
  98  |     // Should still see Questions nav
  99  |     await expect(page.locator('a:has-text("Questions")')).toBeVisible();
  100 |   });
  101 | 
  102 |   test("category sidebar is visible on questions page", async ({ page }) => {
  103 |     await login(page, "admin", "admin");
  104 |     // Should see a category button in the sidebar
  105 |     await expect(page.locator('button:has-text("Customer")')).toBeVisible({ timeout: 15000 });
  106 |   });
  107 | });
  108 | 
```