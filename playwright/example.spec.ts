import { test, expect } from "@playwright/test";

test("homepage has title and links to intro page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/New Remix App/);

  // create a locator
  const getStarted = page.getByRole("button", {
    name: "Sign In with Auth0",
  });

  await expect(getStarted).toBeVisible();

  // Click the get started link.
  await getStarted.click();

  // const newPagePromise = page.waitForEvent("popup");

  // const newPage = await newPagePromise;
  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*auth0/);
});
