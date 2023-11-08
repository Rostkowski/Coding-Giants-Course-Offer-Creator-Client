import { Page, request } from "@playwright/test";
import { EnumSelector } from "../enums/enumSelectors";

export class SelectCourseKindPage {
    private readonly page: Page;
    courseKinds: string[];
    enumValuesForStationaryKinds: string[];
    
    constructor(page: Page) {
        this.page = page;
    }

    async getCourseKinds(currentCountry: string, currentLanguage: string): Promise<void> {
        const context = await request.newContext();
        const data = await context.get(`https://giganciprogramowaniaformularz.edu.pl/api/Course/courseKindsProgrammingType`, {
            headers: {
                currentCountry: currentCountry,
                currentLanguage: currentLanguage,
            }
        });

        const response = await data.json();

        const stationaryKinds = await response['stationaryKinds']?.map((kind: any) => kind.kindName) ?? [];
        const onlineKinds = await response['onlineKinds']?.map((kind: any) => kind.kindName) ?? [];
        const stationaryKindsEnums = await response['stationaryKinds']?.map((kind: any) => kind.kind) ?? [];

        this.enumValuesForStationaryKinds = stationaryKindsEnums;
        this.courseKinds = stationaryKinds.concat(onlineKinds);
    }

    async selectCourseKind(courseKindName: string): Promise<void> {
        await this.page.selectOption(`${EnumSelector.selectCourseKindSelector}`, courseKindName);
    }
}