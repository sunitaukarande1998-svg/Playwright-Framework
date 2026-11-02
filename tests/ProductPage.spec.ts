import { test, expect } from '@playwright/test';
import { ProductPage } from '../Pages/ProductPage';
import { BASE_URL, USERNAME, PASSWORD } from '../Utils/envConfig';
import { LoginPage } from '../Pages/LoginPage';
import{LoginLocators} from '../Locators/LoginLOcators.spec';
import { ProductPageLocators } from '../Locators/ProductPageLocators';
import { productsToCart } from '../test_data/Products';

test.describe('Product Page Validation', () => {

    let productPage: ProductPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test('Validate Logout Functionality', async ({ page })=>{
        await productPage.logout();
        await expect(page.locator(LoginLocators.loginButton))
    })

    test('Validate About Page and navigate back to Product Page', async ({ page })=>{
        await productPage.openAboutPage();
        //await expect(page.locator(ProductPageLocators.tryItFreeButton)).toBeVisible();

        await expect(page.getByRole('link', { name: 'Book a Demo' }).nth(1)).toBeVisible();
        await page.goBack();
        await expect(page.locator(ProductPageLocators.settingIcon)).toBeVisible();
    })

    test("Validate Product Page", async ({ page })=>{
        await productPage.validateProductDisplayed();
        await productPage.addFirstProductToCart();
        await productPage.addAllProductsToCart();
    })

     test("Validate adding specific Product to cart", async ({ page })=>{
        await productPage.addSpecificProductsToCart(productsToCart);       
    })

    test.only('Filter Products by Name A to Z',async ({ page })=>{
        await productPage.filterByNameAtoZ();
        const names=await productPage.getProductNames();
        const sorted=[...names].sort();
        await expect(names).toEqual(sorted);
    })

    test.only('Filter Products by Name Z to A',async ({ page })=>{
        await productPage.filterByNameZtoA();
        const names=await productPage.getProductNames();
        const sorted=[...names].sort().reverse();
        await expect(names).toEqual(sorted);
    })

    test.only('Filter Products by Price Low to High',async ({ page })=>{
        await productPage.filterByLowToHigh();
        const prices=await productPage.getProductPrices();
        const sortedPrice=[...prices].sort((a,b)=>a-b)
        expect(prices).toEqual(sortedPrice);
    })

     test.only('Filter Products by Price High to Low',async ({ page })=>{
         await productPage.filterByHighToLow();
        const prices=await productPage.getProductPrices();
        const sortedPrice=[...prices].sort((a,b)=>b-a)
        expect(prices).toEqual(sortedPrice);
    })

})