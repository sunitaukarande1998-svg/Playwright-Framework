import { Page } from '@playwright/test';
import { CheckOutPageLocators } from '../Locators/CheckOutPageLocators';
import { checkOutData } from '../test_data/CheckoutData';

export class CheckOutPage {
    constructor(private page: Page) { }

    async getCheckOutPageElements() {
        return {
            pageInfo: await this.page.locator(CheckOutPageLocators.pageInfo),
            cancle: await this.page.locator(CheckOutPageLocators.cancleButton),
            continue: await this.page.locator(CheckOutPageLocators.continueButton),

        }
    }

    async fillCheckOutForm(firstName: string, lastName: string, zipCode: string) {
        await this.page.fill(CheckOutPageLocators.firstName, firstName);
        await this.page.fill(CheckOutPageLocators.lastName, lastName);
        await this.page.fill(CheckOutPageLocators.zipCode, zipCode);
    }

    async clickCancelButton() {
        await this.page.click(CheckOutPageLocators.cancleButton);
    }
    async clickContinueButton() {
        await this.page.click(CheckOutPageLocators.continueButton);
    }

    async getErrorMessage() {
        return await this.page.locator(CheckOutPageLocators.errorMessage).textContent();
    }
}
