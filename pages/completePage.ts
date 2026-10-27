import { Page, Locator } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class CompletePage {
    readonly page: Page;
    readonly completeTitle: Locator;
    readonly generatePDFButton: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.completeTitle = page.locator('[data-test="title"]');
        this.generatePDFButton = page.locator('[data-test="generate-pdf-order"]');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async downloadPDF() {
        // Start waiting for download before clicking. Note no await.
        const downloadPromise = this.page.waitForEvent('download');
        await this.generatePDFButton.click();
        const download = await downloadPromise;

        // Wait for the download process to complete and save the downloaded file somewhere.
        const downloadFolder = path.join(process.cwd(), 'downloads');
        fs.mkdirSync(downloadFolder, { recursive: true });
        const pathPDF = path.join(downloadFolder, download.suggestedFilename());
        await download.saveAs(pathPDF);
        return pathPDF;
    }

}