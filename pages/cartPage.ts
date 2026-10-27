import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartTitle: Locator;
    readonly productName: Locator;
    readonly cartQuantity: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartTitle = page.locator('[data-test="title"]');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.cartQuantity = page.locator('[data-test="item-quantity"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }
}