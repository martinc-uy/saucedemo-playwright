import { Page, Locator } from '@playwright/test';

export class OverviewPage {
    readonly page: Page;
    readonly overviewTitle: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly subtotalPrice: Locator;
    readonly taxPrice: Locator;
    readonly totalPrice: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.overviewTitle = page.locator('[data-test="title"]');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.productPrice = page.locator('[data-test="inventory-item-price"]');
        this.subtotalPrice = page.locator('[data-test="subtotal-label"]');
        this.taxPrice = page.locator('[data-test="tax-label"]');
        this.totalPrice = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
    }
    
    async getSubtotal() {
        const subTotal = await this.subtotalPrice.innerText();
        return parseFloat(subTotal.replace('Item total: $', ''));
    }

    async getTax() {
        const tax = await this.taxPrice.innerText();
        return parseFloat(tax.replace('Tax: $', ''));
    }

}