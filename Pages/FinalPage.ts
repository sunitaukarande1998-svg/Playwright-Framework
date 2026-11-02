import { Page } from "@playwright/test";
import { FinalPageLocators } from "../Locators/FinalPageLocators";

export class FinalPage {
    constructor(private page: Page) { }

    async getFinalPageElements() {
        return {
            pageInfo: this.page.locator(FinalPageLocators.pageInfo),
            backHomeButton: this.page.locator(FinalPageLocators.backHomeButton),
            successMessage: this.page.locator(FinalPageLocators.successMessage),
        }
    }

    async getSuccessMessageText() {
        const text = await this.page.locator(FinalPageLocators.successMessage).innerText();
        return (await text).trim();
    }
    async clickBackHomeButton() {
        await this.page.click(FinalPageLocators.backHomeButton);

    }
}