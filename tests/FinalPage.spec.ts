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
import { CheckOutOverviewPage } from '../Pages/CheckOutOverviewPage';
import { FinalPage } from '../Pages/FinalPage';

test.describe('Final Page Validation', () => {

    let productPage: ProductPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    let finalPage: FinalPage;
    let checkOutPage: CheckOutPage;
    let checkOutOverviewPage: CheckOutOverviewPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkOutPage = new CheckOutPage(page);
        checkOutOverviewPage = new CheckOutOverviewPage(page);
        finalPage = new FinalPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        for (const product of productsToCart) {
            await productPage.getSpecificProductDetails(product);
        }
        await productPage.clickCartLink();
        await cartPage.clickCheckoutButton();
        await checkOutPage.fillCheckOutForm(checkOutData.firstName, checkOutData.lastName, checkOutData.zipCode);
        await checkOutPage.clickContinueButton();
        await checkOutOverviewPage.clickFinishButton();
    })
    test('Validate checkout Overview page UI Elemenets and URL', async ({ page }) => {
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        const elements = await finalPage.getFinalPageElements();
        await expect(elements.backHomeButton).toBeVisible();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.successMessage).toBeVisible();
    })

    test('Validate Success Message', async ({ page }) => {
        const message = await finalPage.getSuccessMessageText();
        await expect(message).toBe('Thank you for your order!');
    })

    test('Validate Back Home Button', async ({ page }) => {
        await finalPage.clickBackHomeButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })
})
