import { Page } from '@playwright/test';
import { CartPageLocators } from '../Locators/CartPageLocators';

export class CartPage {
    constructor(private page: Page) { }

    async clickContinueShopping() {
        await this.page.click(CartPageLocators.continueShoppingButton);

    }
    async getCartPageElements() {
        return {

            cartTitle: await this.page.locator(CartPageLocators.cartTitle),
            shoppingCart: await this.page.locator(CartPageLocators.continueShoppingButton),
            checkoutButton: await this.page.locator(CartPageLocators.checkoutButton),
        }
    }

    async getProducts() {
        const allNames = await this.page.locator(CartPageLocators.productsName).allTextContents();
        const allDescriptions = await this.page.locator(CartPageLocators.productDescription).allTextContents();
        const allPrices = await this.page.locator(CartPageLocators.productPrice).allTextContents();

        //array of object
        const allProducts = allNames.map((_, i) => ({
            name: allNames[i]?.trim(),
            description: allDescriptions[i]?.trim(),
            price: allPrices[i]?.trim(),

        }));
        return allProducts;

    }
    async removeFirstProduct() {
        await this.page.locator(CartPageLocators.removeButton).first().click();
    }
    async clickCheckoutButton() {
        await this.page.click(CartPageLocators.checkoutButton);
    }
}