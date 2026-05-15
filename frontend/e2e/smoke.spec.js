import { test, expect } from "@playwright/test";

// Helper to log in as a user
async function login(page, username, password) {
  await page.goto("/login");
  await page.waitForSelector("#username", { timeout: 15000 });
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  // Wait for redirect to home
  await page.waitForURL("/", { timeout: 20000 });
}

// Helper to open the user dropdown menu in the header
async function openUserDropdown(page) {
  // Click the user icon button (the last button with an SVG in the header)
  const userBtn = page.locator("header button").last();
  await userBtn.click();
  // Wait for dropdown animation
  await page.waitForTimeout(300);
}

test.describe("Smoke Tests", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#username")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("can log in as admin", async ({ page }) => {
    await login(page, "admin", "admin");
    await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator("header")).toContainText("admin");
  });

  test("can log in as demo user", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await expect(page.locator('a:has-text("Questions")')).toBeVisible({ timeout: 10000 });
  });

  test("home page shows categories and leaderboard", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await expect(page.locator("text=Explore Categories")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Leaderboard")).toBeVisible();
  });

  test("questions page loads with seeded questions", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Questions")');
    await expect(page.locator("h1:has-text('Questions')")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=How does the company handle work-life balance?")).toBeVisible({ timeout: 15000 });
  });

  test("can navigate to question detail", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Questions")');
    await page.click("text=How does the company handle work-life balance?");
    await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });
  });

  test("can navigate to Ask page", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Ask")');
    await expect(page.locator("h1:has-text('Ask a Question')")).toBeVisible({ timeout: 10000 });
  });

  test("dark mode toggle works", async ({ page }) => {
    await login(page, "demo", "demo1234");
    // Find the theme toggle button (first button in header - contains sun/moon)
    const themeBtn = page.locator("header button").first();
    await themeBtn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await themeBtn.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("user dropdown shows profile options", async ({ page }) => {
    await login(page, "admin", "admin");
    await openUserDropdown(page);
    await expect(page.locator("text=Settings")).toBeVisible();
    await expect(page.locator("text=View Profile")).toBeVisible();
    await expect(page.locator("text=Sign Out")).toBeVisible();
  });

  test("admin sees SQL Console in dropdown", async ({ page }) => {
    await login(page, "admin", "admin");
    await openUserDropdown(page);
    await expect(page.locator("text=SQL Console")).toBeVisible();
  });

  test("non-admin does NOT see SQL Console in dropdown", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await openUserDropdown(page);
    await expect(page.locator("text=SQL Console")).toHaveCount(0);
  });

  test("settings page loads", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await openUserDropdown(page);
    await page.click("text=Settings");
    await expect(page.locator("h1:has-text('Settings')")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Profile Information")).toBeVisible();
    await expect(page.locator("text=Patron Topics")).toBeVisible();
  });

  test("user profile page loads", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await openUserDropdown(page);
    await page.click("text=View Profile");
    await expect(page.locator("h1:has-text('demo')")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Reputation")).toBeVisible();
  });
});

test.describe("Full User Flow", () => {
  const uniqueId = Date.now();
  const questionTitle = `E2E Test Question ${uniqueId}`;
  const questionBody = `This is an automated E2E test question. ID: ${uniqueId}`;
  const answerBody = `Patron answer to E2E test question. ID: ${uniqueId}`;

  test("post question → answer → upvote → accept → edit → delete", async ({ page }) => {
    // =============================================
    // STEP 1: Post a question as demo (non-patron)
    // =============================================
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Ask")');
    await expect(page.locator("h1:has-text('Ask a Question')")).toBeVisible({ timeout: 10000 });

    await page.fill("#title", questionTitle);
    await page.fill("textarea", questionBody);
    await page.click('button:has-text("Post Question")');

    // Should redirect to questions page
    await page.waitForURL("/questions", { timeout: 15000 });
    await expect(page.locator(`text=${questionTitle}`)).toBeVisible({ timeout: 10000 });

    // Navigate to the question
    await page.click(`text=${questionTitle}`);
    await expect(page.locator("h1")).toContainText(questionTitle, { timeout: 10000 });

    // demo owns this question — should see Edit and Delete
    await expect(page.locator("button:has-text('Edit')")).toBeVisible();
    await expect(page.locator("button:has-text('Delete')")).toBeVisible();

    const questionUrl = page.url();

    // =============================================
    // STEP 2: Sign in as admin and post an answer
    // =============================================
    await openUserDropdown(page);
    await page.click("text=Sign Out");
    await page.waitForURL("/login", { timeout: 10000 });

    await login(page, "admin", "admin");
    await page.goto(questionUrl);
    await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });

    await page.fill('textarea[placeholder="Write your answer here..."]', answerBody);
    await page.click('button:has-text("Post Your Answer")');
    await expect(page.locator(`text=${answerBody}`)).toBeVisible({ timeout: 10000 });

    // Upvote the question as admin
    const voteButtons = page.locator("button").filter({ has: page.locator("svg") });
    // The first upvote arrow button in the question section
    await page.locator(".flex.flex-col.items-center button").first().click();
    await page.waitForTimeout(1000);

    // =============================================
    // STEP 3: Sign back as demo, accept & upvote answer
    // =============================================
    await openUserDropdown(page);
    await page.click("text=Sign Out");
    await page.waitForURL("/login", { timeout: 10000 });

    await login(page, "demo", "demo1234");
    await page.goto(questionUrl);
    await expect(page.locator(`text=${answerBody}`)).toBeVisible({ timeout: 10000 });

    // Accept the answer
    const acceptBtn = page.locator("button[title='Accept this answer']");
    if (await acceptBtn.count() > 0) {
      await acceptBtn.click();
      await page.waitForTimeout(1500);
      await expect(page.locator("text=Accepted")).toBeVisible({ timeout: 5000 });
    }

    // =============================================
    // STEP 4: Edit the question
    // =============================================
    await page.click("button:has-text('Edit')");
    const titleInput = page.locator("input").first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    const editedTitle = `${questionTitle} (edited)`;
    await titleInput.fill(editedTitle);
    await page.click("button:has-text('Save')");
    await page.waitForTimeout(1500);
    await expect(page.locator("h1")).toContainText("(edited)", { timeout: 5000 });

    // =============================================
    // STEP 5: Check admin's profile for reputation
    // =============================================
    await page.goto("/users/admin");
    await expect(page.locator("h1:has-text('admin')")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Reputation")).toBeVisible();

    // =============================================
    // STEP 6: Delete the question (cleanup)
    // =============================================
    await page.goto(questionUrl);
    await expect(page.locator("button:has-text('Delete')")).toBeVisible({ timeout: 10000 });

    page.on("dialog", (dialog) => dialog.accept());
    await page.click("button:has-text('Delete')");
    await page.waitForURL("/questions", { timeout: 15000 });
    await expect(page.locator(`text=${editedTitle}`)).toHaveCount(0, { timeout: 5000 });
  });

  test("search questions works", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Questions")');
    await expect(page.locator("h1:has-text('Questions')")).toBeVisible({ timeout: 10000 });

    await page.fill('input[placeholder="Search questions..."]', "React state management");
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Best practices for React state management")).toBeVisible({ timeout: 10000 });
  });

  test("SQL console executes queries for admin", async ({ page }) => {
    await login(page, "admin", "admin");
    await openUserDropdown(page);
    await page.click("text=SQL Console");
    await expect(page.locator("h1:has-text('SQL Console')")).toBeVisible({ timeout: 10000 });

    await page.fill("textarea#sql", "SELECT COUNT(*) as cnt FROM auth_user");
    await page.click('button:has-text("Execute")');
    await expect(page.locator("th:has-text('cnt')")).toBeVisible({ timeout: 10000 });
  });

  test("add comment to a question", async ({ page }) => {
    await login(page, "demo", "demo1234");
    await page.click('a:has-text("Questions")');
    await page.click("text=How does the company handle work-life balance?");
    await expect(page.getByRole("heading", { name: "Your Answer" })).toBeVisible({ timeout: 10000 });

    const commentText = `E2E comment ${Date.now()}`;
    await page.fill('input[placeholder="Add a comment..."]', commentText);
    await page.locator("button:has-text('Comment')").first().click();
    await expect(page.locator(`text=${commentText}`)).toBeVisible({ timeout: 10000 });
  });
});
