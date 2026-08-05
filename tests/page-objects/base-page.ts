import { expect, Locator, Page } from "@playwright/test";
import { LOG } from "../helpers/logger"


export default class BasePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string): Promise<void> {
        await LOG("info", `Navigating to URL: ${url}`);
        await this.page.goto(url);
    }

    async getTitle(): Promise<string> {
        await LOG("info", "Fetching page title");
        return await this.page.title();
    }

    async click(ele: Locator) {
        try {
            await expect(ele).toBeVisible({ timeout: 15_000 });
            await LOG("info", "Waiting for element to be visible");
            await ele.click();
        } catch (error) {
            await LOG("error", `Element not visible: ${error}`);
            throw error;
        }
    }

    async fill(ele: Locator, text: string) {
        try {
            await expect(ele).toBeVisible({ timeout: 15_000 });
            await LOG("info", `Filling element with text: ${text}`);
            await ele.fill(text);
        } catch (error) {
            await LOG("error", `Failed to fill element: ${error}`);
            throw error;
        }
    }
}
