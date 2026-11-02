import { Page } from '@playwright/test';
import { ProductPageLocators } from '../Locators/ProductPageLocators';

export class ProductPage {
    constructor(private page: Page) {

    }
    async logout() {
        await this.page.click(ProductPageLocators.settingIcon);
        await this.page.click(ProductPageLocators.logoutLink);
    }

    async openAboutPage() {
        await this.page.click(ProductPageLocators.settingIcon);
        await this.page.click(ProductPageLocators.aboutLink);
    }
    async validateProductDisplayed() {
        const productNames = await this.page.locator(ProductPageLocators.productsName).allTextContents();
        const productDescriptions = await this.page.locator(ProductPageLocators.productDescription).allTextContents();
        const productPrices = await this.page.locator(ProductPageLocators.productPrice).allTextContents();
        const buttonCount = await this.page.locator(ProductPageLocators.addToCartButton).count();

        if (productNames.length === 0) {
            throw new Error('No products found on the page.');

            if (productNames.length !== productDescriptions.length || productNames.length !== productPrices.length || productNames.length !== buttonCount) {
                throw new Error('Mismatch between the product details.');
            }
        }

    }
    async addFirstProductToCart() {
        await this.page.locator(ProductPageLocators.addToCartButton).first().click();
    }

    async addAllProductsToCart() {
        const addToCartButtons = await this.page.locator(ProductPageLocators.addToCartButton);
        const count = await addToCartButtons.count();
        for (let i = 0; i < count; i++) {
            await addToCartButtons.nth(i).click();
            // await this.page.waitForTimeout(3000); 
        }
    }

    async addSpecificProductsToCart(productNames: string[]) {
        const allProducts = await this.page.locator(ProductPageLocators.productsName);
        const count = await allProducts.count();

        for (let i = 0; i < count; i++) {
            const name = await allProducts.nth(i).textContent();
            if (name && productNames.includes(name.trim())) {
                await this.page.locator(ProductPageLocators.addToCartButton).nth(i).click();
            }
        }
    }

    async filterByNameAtoZ() {
        await this.page.selectOption(ProductPageLocators.filterDropdown, 'az');

    }
    async filterByNameZtoA() {
        await this.page.selectOption(ProductPageLocators.filterDropdown, 'za');

    }

    async filterByLowToHigh() {
        await this.page.selectOption(ProductPageLocators.filterDropdown, 'lohi');

    }
    async filterByHighToLow() {
        await this.page.selectOption(ProductPageLocators.filterDropdown, 'hilo');

    }

    async getProductNames() {
        return await this.page.locator(ProductPageLocators.productsName).allTextContents();
    }
    async getProductPrices() {
        const prices = await this.page.locator(ProductPageLocators.productPrice).allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }
    async clickCartLink() {
        await this.page.click(ProductPageLocators.cartLink);
    }

    async getFirstProductDetails() {
        const name = await this.page.locator(ProductPageLocators.productsName).first().textContent();
        const description = await this.page.locator(ProductPageLocators.productDescription).first().textContent();
        const price = await this.page.locator(ProductPageLocators.productPrice).first().textContent();
        return {
            name: name?.trim(),
            description: description?.trim(),
            price: price?.trim()
        };
    }

    async getAllProductDetails() {
        const allNames = await this.page.locator(ProductPageLocators.productsName).allTextContents();
        const allDescriptions = await this.page.locator(ProductPageLocators.productDescription).allTextContents();
        const allPrices = await this.page.locator(ProductPageLocators.productPrice).allTextContents();

        //array of object
        const allProducts = allNames.map((_, i) => ({
            name: allNames[i]?.trim(),
            description: allDescriptions[i]?.trim(),
            price: allPrices[i]?.trim(),

        }));
        return allProducts;
    }
    async getSpecificProductDetails(productName: string) {
       const allNames = await this.page.locator(ProductPageLocators.productsName).allTextContents();
        const allDescriptions = await this.page.locator(ProductPageLocators.productDescription).allTextContents();
        const allPrices = await this.page.locator(ProductPageLocators.productPrice).allTextContents();

        //array of object
        const allProducts = allNames.map((_, i) => ({
            name: allNames[i]?.trim(),
            description: allDescriptions[i]?.trim(),
            price: allPrices[i]?.trim(),

        }));
        return allProducts.filter(p=>productName.includes(p.name));
    }
}