import { test, expect } from '@playwright/test';
import { SelectCountryPage } from './pageObjects/selectCountryPage';
import { EnumSelector } from './enums/enumSelectors';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test("When clicking on select element with label 'select country' a list with with available countries should appear.", async ({ page }) => {
  const selectCountryPage = new SelectCountryPage(page);

  await expect(page.locator(EnumSelector.selectCountrySelector)).toHaveText(selectCountryPage.selectElements.join(''));
})

test("When clicking on the '---' element inside select element with label 'select country' nothing should happen ", async ({ page }) => {
  const selectCountryPage = new SelectCountryPage(page);

  await selectCountryPage.selectCountry("---");
  await expect(page.locator(EnumSelector.selectCountrySelector)).toBeVisible();
})

test('When clicking on the "Poland" option inside select element with label "select country" a new selectbox should appear', async ({ page }) => {
  const selectCountryPage = new SelectCountryPage(page);

  await selectCountryPage.selectCountry("Poland");
  await expect(page.locator(EnumSelector.selectCourseKindSelector)).toBeVisible()
});

test("When clicking on the 'Spain' option inside select element with label 'select country' a new selectbox should appear", async ({page}) => {
  const selectCountryPage = new SelectCountryPage(page);

  await selectCountryPage.selectCountry("Spain");
  await expect(page.locator(EnumSelector.selectCourseKindSelector)).toBeVisible();
})
