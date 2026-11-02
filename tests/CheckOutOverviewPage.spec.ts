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

test.describe('Checkout overview Validation', () => {

    let productPage: ProductPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;
    let checkOutPage: CheckOutPage;
    let checkOutOverviewPage: CheckOutOverviewPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkOutPage = new CheckOutPage(page);
        checkOutOverviewPage = new CheckOutOverviewPage(page);

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
    })

    test('Validate checkout Overview page UI Elemenets and URL', async ({ page }) => {
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        const elements = await checkOutOverviewPage.getCheckOutOverviewPageElements();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.cancelButton).toBeVisible();
        await expect(elements.finishButton).toBeVisible();
    })
    test('Validate Cancle button functionality', async ({ page }) => {
        await checkOutOverviewPage.clickCancelButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test('Validate item total calculation', async ({ page }) => {
        const overviewProducts = await checkOutOverviewPage.getOverviewProducts();
        const calculateTotal = overviewProducts.reduce((sum, { price }) => sum + parseFloat(price.replace('$', '')), 0);
        const UIItemTotal = await checkOutOverviewPage.getItemTotal();
        expect(calculateTotal).toBe(UIItemTotal);
    })

     test('Validate final total (Item total + Tax)', async ({ page }) => {
        const itemtotal=await checkOutOverviewPage.getItemTotal();
        const tax=await checkOutOverviewPage.getTax();
        const finalTotal=await checkOutOverviewPage.getTotal();

        const expectedFinalTotal=itemtotal+tax;
        expect(finalTotal).toBe(expectedFinalTotal);
    })
})