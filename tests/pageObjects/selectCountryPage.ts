import { Locator, Page, expect } from "@playwright/test";
import { EnumSelector } from "../enums/enumSelectors";

export class SelectCountryPage {
    private readonly page: Page;
    readonly selectElements: string[] = ["---", "Poland", "Spain"];

    constructor(page: Page) {
        this.page = page;
    }

    async selectCountry(countryName: string): Promise<void> {
        await this.page.selectOption(EnumSelector.selectCountrySelector, countryName);
    }
}