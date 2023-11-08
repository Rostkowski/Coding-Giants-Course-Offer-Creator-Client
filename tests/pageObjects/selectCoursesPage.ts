import { Page } from "@playwright/test";
import { EnumSelector } from "../enums/enumSelectors";

export class SelectCoursesPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}