import { test, expect } from '@playwright/test';
import { ProductPage } from '../Pages/ProductPage';
import { BASE_URL, USERNAME, PASSWORD } from '../Utils/envConfig';
import { LoginPage } from '../Pages/LoginPage';
import { LoginLocators } from '../Locators/LoginLOcators.spec';
import { ProductPageLocators } from '../Locators/ProductPageLocators';
import { productsToCart } from '../test_data/Products';
import { CartPage } from '../Pages/CartPage';
import { CheckOutPage } from '../Pages/CheckOutPage';
import { checkOutData } from '../test_data/CheckoutData';

test.describe('Product Page Validation', () => {

    let productPage: ProductPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    let checkOutPage: CheckOutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkOutPage = new CheckOutPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await productPage.addFirstProductToCart();
        await productPage.clickCartLink();

    })

    test('Validate checkout page UI Elemenets and URL', async ({ page }) => {
        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        const elements = await checkOutPage.getCheckOutPageElements();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.cancle).toBeVisible();
        await expect(elements.continue).toBeVisible();

    })



    test('Validate Cancle button functionality', async ({ page }) => {
        await cartPage.clickCheckoutButton();
        await checkOutPage.clickCancelButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    })

    test('Validate Continue button functionality', async ({ page }) => {
        await cartPage.clickCheckoutButton();
        await checkOutPage.fillCheckOutForm(checkOutData.firstName, checkOutData.lastName, checkOutData.zipCode);
        await checkOutPage.clickContinueButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    })

     test('Validate the error when clicking with no data', async ({ page }) => {
        await cartPage.clickCheckoutButton();
        await checkOutPage.clickContinueButton();
        const errorMessage = await checkOutPage.getErrorMessage();
        await expect(errorMessage?.trim()).toBe('Error: First Name is required');
    })

})