import { test, expect } from "@playwright/test";

test.describe("Share-A-Book smoke flow", () => {
  test("user registers, shares a book, and approval flow completes", async ({
    page,
    browser
  }) => {
    const timestamp = Date.now();
    const ownerEmail = `owner-${timestamp}@example.com`;
    const ownerPassword = "testpass123!";
    const bookTitle = `Automation Book ${timestamp}`;

    // Register new user
    await page.goto("/register");
    await page.getByLabel("Name").fill("Automation Owner");
    await page.getByLabel("Email address").fill(ownerEmail);
    await page.getByLabel("Password").fill(ownerPassword);
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/");

    // Add a book
    await page.goto("/dashboard/new-book");
    await page.getByLabel("Book title").fill(bookTitle);
    await page.getByLabel("Author").fill("Automation Author");
    await page
      .getByLabel("Description")
      .fill("This book was added during an automated smoke test.");
    await page.getByRole("button", { name: "Share this book" }).click();
    await page.waitForURL("**/dashboard");

    await expect(page.getByTestId("book-card")).toContainText(bookTitle);

    // Borrower session using seeded Alice account
    const borrowerContext = await browser.newContext();
    const borrowerPage = await borrowerContext.newPage();
    await borrowerPage.goto("/login");
    await borrowerPage.getByLabel("Email address").fill("alice@example.com");
    await borrowerPage.getByLabel("Password").fill("password123");
    await borrowerPage.getByRole("button", { name: "Sign in" }).click();
    await borrowerPage.waitForURL("**/");

    // Borrow the new book
    const bookCard = borrowerPage
      .getByTestId("book-card")
      .filter({ hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await bookCard.getByTestId("borrow-button").click();
    await expect(bookCard.getByTestId("borrow-button")).toHaveText("Request sent");

    // Owner approves the request
    await page.bringToFront();
    await page.goto("/dashboard");
    const requestSection = page.getByText("Borrow requests");
    await expect(requestSection).toBeVisible();
    const approveButton = page
      .getByRole("button", { name: "APPROVED" })
      .first();
    await approveButton.click();
    await expect(page.getByTestId("request-status")).toHaveText("APPROVED");

    // Borrower sees updated state
    await borrowerPage.bringToFront();
    await borrowerPage.reload({ waitUntil: "networkidle" });
    await expect(
      borrowerPage
        .getByTestId("book-card")
        .filter({ hasText: bookTitle })
        .getByTestId("borrow-button")
    ).toHaveText("Request sent");

    await borrowerContext.close();
  });
});
