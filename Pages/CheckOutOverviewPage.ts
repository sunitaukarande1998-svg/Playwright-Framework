import { Page } from "@playwright/test";
import { CheckOutOverviewLocators } from "../Locators/CheckOutOverviewLocators";

export class CheckOutOverviewPage {
    constructor(private page: Page) { }

    async getCheckOutOverviewPageElements() {
        return {
            pageInfo: this.page.locator(CheckOutOverviewLocators.pageInfo),
            cancelButton: this.page.locator(CheckOutOverviewLocators.cancleButton),
            finishButton: this.page.locator(CheckOutOverviewLocators.finishButton),

        }
    }
    async getOverviewProducts() {
        const allNames = await this.page.locator(CheckOutOverviewLocators.productsName).allTextContents();
        const allDescriptions = await this.page.locator(CheckOutOverviewLocators.productDescription).allTextContents();
        const allPrices = await this.page.locator(CheckOutOverviewLocators.productPrice).allTextContents();

        //array of object
        const allProducts = allNames.map((_, i) => ({
            name: allNames[i]?.trim(),
            description: allDescriptions[i]?.trim(),
            price: allPrices[i]?.trim(),

        }));
        return allProducts;
    }
    async getItemTotal() {
        const text = await this.page.locator(CheckOutOverviewLocators.itemTotal).textContent();
        return parseFloat(text!.replace('Item total: $', '').trim());
    }
    async getTax() {
        const text = await this.page.locator(CheckOutOverviewLocators.tax).textContent();
        return parseFloat(text!.replace('Tax: $', '').trim());
    }
    async getTotal() {
        const text = await this.page.locator(CheckOutOverviewLocators.total).textContent();
        return parseFloat(text!.replace('Total: $', '').trim());
    }

    async clickCancelButton() {
        await this.page.click(CheckOutOverviewLocators.cancleButton);
    }

    async clickFinishButton() {
        await this.page.click(CheckOutOverviewLocators.finishButton);
    }
}