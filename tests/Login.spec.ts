import{test, expect} from "@playwright/test"
import {LoginPage} from '../Pages/LoginPage';
import {BASE_URL, USERNAME, PASSWORD} from '../Utils/envConfig';

test('Login to SauceDemo Application with valid credentials', async ({ page }) => 
    {
        const loginPage = new LoginPage(page);
        
        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);       
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })