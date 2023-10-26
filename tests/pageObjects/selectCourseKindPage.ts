import { Page } from "@playwright/test";

export class SelectCourseKindPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}