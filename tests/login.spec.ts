import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import testData from '../data/testData.json';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.loadLoginPage();
});

test('1- Sauce demo login', async ({ page }) => {
    await loginPage.fillLogin(testData.standardUser.username, testData.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
});

test('2- Invalid login', async ({ page }) => {
    await loginPage.fillLogin(testData.invalidUser.username, testData.invalidUser.password);
    await expect(loginPage.error).toHaveText('Epic sadface: Username and password do not match any user in this service');
});