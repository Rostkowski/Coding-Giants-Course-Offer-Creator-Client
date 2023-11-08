import { test, expect } from "@playwright/test";
import { SelectCourseKindPage } from "./pageObjects/selectCourseKindPage";
import { EnumSelector } from "./enums/enumSelectors";
import { SelectCountryPage } from "./pageObjects/selectCountryPage";

test.beforeEach(async ({page}) => {
    page.goto("/")
})

test("When clicking on select element with label 'select course kind' a list with available course kinds for Poland should appear. ", async ({page}) => {
    const selectCountryPage = new SelectCountryPage(page);
    const selectCourseKindPage = new SelectCourseKindPage(page);
    
    await selectCountryPage.selectCountry('Poland');
    await selectCourseKindPage.getCourseKinds("PL", "pl-PL");
    await expect(page.locator(`${EnumSelector.selectCourseKindSelector} > option`)).toHaveCount(selectCourseKindPage.courseKinds.length+1)
})

test("When clicking on select element with label 'select course kind' a list with available course kinds for Spain should appear. ", async ({page}) => {
    const selectCountryPage = new SelectCountryPage(page);
    const selectCourseKindPage = new SelectCourseKindPage(page);
    
    await selectCountryPage.selectCountry('Spain');
    await selectCourseKindPage.getCourseKinds("es", "es-ES");
    await expect(page.locator(`${EnumSelector.selectCourseKindSelector} > option`)).toHaveCount(selectCourseKindPage.courseKinds.length+1)
})