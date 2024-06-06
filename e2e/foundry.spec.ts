import { test, expect } from "@playwright/test";

const URL = "http://127.0.0.1:30000";

test("Launches Forbidden Lands", async ({ page }) => {
	await page.goto(URL);

	// Login
	const userSelect = page.locator("select[name='userid']");
	await userSelect.selectOption({ label: "Gamemaster" });

	const submitButton = page.locator("button[name='join']");
	await submitButton.click();

	// Check title
	const title = await page.title();
	expect(title).toBe("PWTEST");

	// Find the chat box and do a test roll
	const chatBox = page.locator("textarea#chat-message");
	await chatBox.fill("/r 10");
	await chatBox.press("Enter");

	const message = page.locator("div.message-content").last();
	await expect(message).toContainText("10");
});
