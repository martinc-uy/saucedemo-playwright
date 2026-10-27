import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import testData from '../data/testData.json';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.loadLoginPage();
});

test('Delete cart item', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.addProduct('Sauce Labs Fleece Jacket');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('3');
    await inventoryPage.removeProduct('Sauce Labs Fleece Jacket');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartTitle).toHaveText('Your Cart');
    await expect(cartPage.productName).toContainText(['Sauce Labs Bolt T-Shirt', 'Sauce Labs Backpack']);
});