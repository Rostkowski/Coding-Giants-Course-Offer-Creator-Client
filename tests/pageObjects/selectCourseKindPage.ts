import { Page, request } from "@playwright/test";

export class SelectCourseKindPage {
    private readonly page: Page;
    courseKinds: string[];

    constructor(page: Page) {
        this.page = page;
    }

    async downloadCourseKinds(currentCountry: string, currentLanguage: string): Promise<void> {
        try {
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

            this.courseKinds = stationaryKinds.concat(onlineKinds);
        } catch (error) {
            console.error("Error fetching data:", error);
            this.courseKinds = [];
        }
    }
}