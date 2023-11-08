import { Page, request } from "@playwright/test";
import { EnumSelector } from "../enums/enumSelectors";

export class SelectLocationPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectLocation(locationName: string): Promise<void> {
        this.page.selectOption(EnumSelector.selectLocationSelector, locationName)
    }

    async getLocationsForStationaryKind(kindName: string, currentCountry: string, currentLanguage: string) {
        const context = await request.newContext();
        const response = await context.get(`https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${kindName}`, {
            headers: {
                currentCountry: currentCountry,
                currentLanguage: currentLanguage
            }
        })

        const jsonResponse = await response.json();

        return jsonResponse;
    }
}