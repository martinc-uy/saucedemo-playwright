import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import testData from '../data/testData.json';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.loadLoginPage();
});

test('1- Product sorting A to Z', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const allProducts = await inventoryPage.getProductNames();
    const sortedProducts = [...allProducts].sort((a, b) => a.localeCompare(b));
    await inventoryPage.sortDropdown.selectOption('az');
    const productsInPage = await inventoryPage.productNames.allTextContents();
    expect(productsInPage).toEqual(sortedProducts);
});

test('2- Product sorting Z to A', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const allProducts = await inventoryPage.getProductNames();
    const sortedProducts = [...allProducts].sort((a, b) => b.localeCompare(a));
    await inventoryPage.sortDropdown.selectOption('za');
    const productsInPage = await inventoryPage.productNames.allTextContents();
    expect(productsInPage).toEqual(sortedProducts);
});

test('3- Product sorting ascending price', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const allPrices = await inventoryPage.getProductPrices();
    const sortedPrices = [...allPrices].sort((a, b) => a - b);
    await inventoryPage.sortDropdown.selectOption('lohi');
    const pricesInPage = await inventoryPage.getProductPrices();
    expect(pricesInPage).toEqual(sortedPrices);
});

test('4- Product sorting descending price', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    const allPrices = await inventoryPage.getProductPrices();
    const sortedPrices = [...allPrices].sort((a, b) => b - a);
    await inventoryPage.sortDropdown.selectOption('hilo');
    const pricesInPage = await inventoryPage.getProductPrices();
    expect(pricesInPage).toEqual(sortedPrices);
});

test('5- Image load validation', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    await inventoryPage.validateImages();
});