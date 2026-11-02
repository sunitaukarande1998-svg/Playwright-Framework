import { test, expect } from '@playwright/test';
import { ProductPage } from './../../Pages/ProductPage';
import { BASE_URL, USERNAME, PASSWORD } from '../../Utils/envConfig';
import { LoginPage } from '../../Pages/LoginPage';
import { LoginLocators } from '../../Locators/LoginLOcators.spec';
import { ProductPageLocators } from '../../Locators/ProductPageLocators';
import { productsToCart } from '../../test_data/Products';
import { CartPage } from '../../Pages/CartPage';

test.describe('Product Page Validation', () => {

    let productPage: ProductPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test('Validate Cart page URL and UI Elements', async ({ page }) => {
        await productPage.addFirstProductToCart();
        await productPage.clickCartLink();
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        const ui = cartPage.getCartPageElements();
        await expect((await ui).cartTitle).toBeVisible();
        expect((await ui).shoppingCart).toBeVisible();
        expect((await ui).checkoutButton).toBeVisible();

    })
    test.only('Validate Continue shopping functionality', async ({ page }) => {
        await productPage.addFirstProductToCart();
        await productPage.clickCartLink();
        await cartPage.clickContinueShopping();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test.only('Validate Single product to the cart page', async ({ page }) => {
        const firstproduct = await productPage.getFirstProductDetails();
        await productPage.addFirstProductToCart();
        await productPage.clickCartLink();

        const cardProducts = await cartPage.getProducts();
        expect(cardProducts[0]).toEqual(firstproduct)
    })

    test.only('Validate all product added to the cart page', async ({ page }) => {
        const allProductsDetails = await productPage.getAllProductDetails();
        await productPage.addAllProductsToCart();
        await productPage.clickCartLink();
        const cardProducts = await cartPage.getProducts();
        expect(cardProducts).toEqual(allProductsDetails);


    })
    test.skip('Validate Specific product added to the cart page', async ({ page }) => {
        const specificProductsDetails = await Promise.all(
            productsToCart.map(product => productPage.getSpecificProductDetails(product))
        );
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.clickCartLink();

        const cardProducts = await cartPage.getProducts();
        expect(cardProducts).toEqual(specificProductsDetails);
    })
    test.only('Validate remove functionality', async ({ page }) => {
        await productPage.addAllProductsToCart();
        await productPage.clickCartLink();

        const initialProducts = await cartPage.getProducts();
        expect(initialProducts.length).toBeGreaterThan(0);
        await cartPage.removeFirstProduct();

        const updatedProducts = await cartPage.getProducts();
        expect(updatedProducts.length).toBe(initialProducts.length - 1);
    })
})