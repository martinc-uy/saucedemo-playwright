import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly sortDropdown: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly productContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.productNames = page.locator('[data-test="inventory-item-name"]');
        this.productPrices = page.locator('[data-test="inventory-item-price"]');
        this.productContainer = page.locator('[data-test="inventory-item"]');
    }

    async addProduct(productName: string) {
        const formattedName = productName.toLowerCase().replaceAll(' ', '-');
        await this.page.locator(`[data-test="add-to-cart-${formattedName}"]`).click();
        await expect(this.page.locator(`[data-test="remove-${formattedName}"]`)).toBeVisible();
    }

    async removeProduct(productName: string) {
        const formattedName = productName.toLowerCase().replaceAll(' ', '-');
        await this.page.locator(`[data-test="remove-${formattedName}"]`).click();
        await expect(this.page.locator(`[data-test="add-to-cart-${formattedName}"]`)).toBeVisible();
    }

    async getProductNames() {
        return this.productNames.allTextContents();
    }

    async getProductPrices() {
        const prices = await this.productPrices.allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async getSingleProductPrice(productName: string) {
        const product = this.productContainer.filter({ hasText: productName });
        const price = await product.locator('[data-test="inventory-item-price"]').innerText();
        return parseFloat(price.replace('$', ''));
    }

    async validateImages() {
        for (const product of await this.productContainer.all()) {
            const image = product.locator('img');
            await expect.poll(async () => {
                return await image.evaluate(
                    img => (img as HTMLImageElement).naturalWidth
                );
            }).toBeGreaterThan(0);
        }
    }
}