import { test, expect } from "@playwright/test";
import { SelectCountryPage } from "./pageObjects/selectCountryPage";
import { SelectCourseKindPage } from "./pageObjects/selectCourseKindPage";
import { SelectLocationPage } from "./pageObjects/selectLocationPage";
import { EnumSelector } from "./enums/enumSelectors";

test.beforeEach(async ({ page }) => {
    page.goto("/")
})

test("When clicking on select element with label 'select location' a list with available stationary locations for Poland should appear. ", async ({ page }) => {
    const selectCountryPage = new SelectCountryPage(page);
    const selectCourseKindPage = new SelectCourseKindPage(page);
    const selectLocationPage = new SelectLocationPage(page);

    await selectCountryPage.selectCountry("Poland");

    await selectCourseKindPage.getCourseKinds("PL", "pl-PL");
    await selectCourseKindPage.selectCourseKind(selectCourseKindPage.enumValuesForStationaryKinds[0])

    const locations = await selectLocationPage.getLocationsForStationaryKind(selectCourseKindPage.enumValuesForStationaryKinds[0], "PL", "pl-PL");
    
    await page.locator(EnumSelector.selectLocationSelectBoxIndicator).click();
    await expect(page.locator(EnumSelector.selectLocationOptions)).toHaveCount(locations.length);
})