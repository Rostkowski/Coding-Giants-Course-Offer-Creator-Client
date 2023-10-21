Cypress.Commands.add(
  "generateOffer",
  (country: string, courseKind: string, courseName: string) => {
    cy.get("[data-cy='selectCountry']").select(country);
    cy.get("[data-cy='courseKinds']").select(courseKind);
    cy.get(
      "[data-cy='coursesSelectBox'] > div > div > div:nth-child(1) > div:nth-child(2) > input"
    )
      .type(courseName)
      .type("{enter}");
    cy.get("[data-cy='coursesNextButton']").click();
  }
);
Cypress.Commands.add("getTinyMCEIframeBody", () => {
  return cy
    .get('iframe[id*="tiny"]')
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});
Cypress.Commands.add("baseCourseOfferAssertions", (numberOfLessons: number, numberOfAvailableDates: number) => {
  cy.getTinyMCEIframeBody()
    .find("[data-cy='mailLogo']")
    .should(
      "have.attr",
      "src",
      "https://giganciprogramowania.edu.pl/images/szablon_logo.png"
    )

  cy.getTinyMCEIframeBody()
    .find('[data-cy="coursePlanContainer"]').each(element => {
      expect(element.find('[data-cy="coursePlanLessonContainer"]').length).to.be.equal(numberOfLessons);
    })

  cy.getTinyMCEIframeBody()
    .find('[data-cy="tableWithLessonDates"] > tbody').each(element => {
      expect(element.find('[data-cy="rowWithLessonDates"]').length).to.be.equal(2);
    })

})
