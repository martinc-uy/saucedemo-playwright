import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { OverviewPage } from '../pages/overviewPage';
import { CompletePage } from '../pages/completePage';
import { existsSync, statSync } from 'fs';
import testData from '../data/testData.json';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let overviewPage: OverviewPage;
let completePage: CompletePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    overviewPage = new OverviewPage(page);
    completePage = new CompletePage(page);
    await loginPage.loadLoginPage();
});

test('1- End to end checkout', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const itemPrice = await inventoryPage.getSingleProductPrice('Sauce Labs Bolt T-Shirt');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartTitle).toHaveText('Your Cart');
    await expect(cartPage.productName).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await cartPage.checkoutButton.click();
    await expect(checkoutPage.checkoutTitle).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCheckout('Name', 'LastName', '1234');
    await checkoutPage.continueButton.click();
    await expect(overviewPage.overviewTitle).toHaveText('Checkout: Overview');
    expect(itemPrice).toEqual(await overviewPage.getSubtotal());
    const tax = Math.round(itemPrice * 0.08 * 100) / 100;
    expect(tax).toEqual(await overviewPage.getTax());
    const totalPrice = itemPrice + tax;
    await expect(overviewPage.totalPrice).toHaveText(`Total: $${totalPrice.toFixed(2)}`);
    await overviewPage.finishButton.click();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(completePage.completeTitle).toBeVisible();
    const pathPDF = await completePage.downloadPDF();
    expect(existsSync(pathPDF)).toBe(true);
    expect(statSync(pathPDF).size).toBeGreaterThan(0);
});

test('2- Incomplete checkout', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartTitle).toHaveText('Your Cart');
    await expect(cartPage.productName).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(cartPage.cartQuantity).toHaveText('1');
    await cartPage.checkoutButton.click();
    await expect(checkoutPage.checkoutTitle).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCheckout('', 'LastName', '1234');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toHaveText('Error: First Name is required');
});

test('3- End to end checkout with price check', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const firstItemPrice = await inventoryPage.getSingleProductPrice('Sauce Labs Bolt T-Shirt');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    const secondItemPrice = await inventoryPage.getSingleProductPrice('Sauce Labs Fleece Jacket');
    await inventoryPage.addProduct('Sauce Labs Fleece Jacket');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartTitle).toHaveText('Your Cart');
    await expect(cartPage.productName).toContainText(['Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket']);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await cartPage.checkoutButton.click();
    await expect(checkoutPage.checkoutTitle).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCheckout('Name', 'LastName', '1234');
    await checkoutPage.continueButton.click();
    await expect(overviewPage.overviewTitle).toHaveText('Checkout: Overview');
    const subtotal = firstItemPrice + secondItemPrice;
    expect(subtotal).toEqual(await overviewPage.getSubtotal());
    const tax = Math.round((firstItemPrice + secondItemPrice) * 0.08 * 100) / 100;
    expect(tax).toEqual(await overviewPage.getTax());
    const totalPrice = firstItemPrice + secondItemPrice + tax;
    await expect(overviewPage.totalPrice).toHaveText(`Total: $${totalPrice.toFixed(2)}`);
});