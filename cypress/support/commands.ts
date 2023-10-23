Cypress.Commands.add("selectCountry", (country: string) => {
  cy.get("[data-cy='selectCountry']").select(country);
})
Cypress.Commands.add("selectCourseKind", (courseKind: string) => {
  cy.get("[data-cy='courseKinds']").select(courseKind);
})
Cypress.Commands.add("selectCourses", (courses: string[]) => {
  courses.forEach(course => {
    cy.get(
      "[data-cy='coursesSelectBox'] > div > div > div:nth-child(1) > div:nth-child(2) > input"
    )
      .type(course)
      .type("{enter}");
  })
})
Cypress.Commands.add("clickCoursesNextButton", () => {
  cy.get("[data-cy='coursesNextButton']").click();
})
Cypress.Commands.add("getTinyMCEIframeBody", () => {
  return cy
    .get('iframe[id*="tiny"]')
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});
Cypress.Commands.add("hasExactNumberOfAvailableDates", (numberOfAvailableDates: number) => {
  cy.getTinyMCEIframeBody()
    .find('[data-cy="tableWithLessonDates"] > tbody').each(element => {
      expect(element.find('[data-cy="rowWithLessonDates"]').length).to.be.equal(numberOfAvailableDates);
    })
})
Cypress.Commands.add("hasExactNumberOfLessonsInACourse", (numberOfLessons: number) => {
  cy.getTinyMCEIframeBody()
    .find('[data-cy="coursePlanContainer"]').each(element => {
      expect(element.find('[data-cy="coursePlanLessonContainer"]').length).to.be.equal(numberOfLessons);
    })
})
Cypress.Commands.add("hasExactNumberOfCoursesInOffer", (numberOfCourses: number) => {
  cy.getTinyMCEIframeBody()
    .find('[data-cy="courseOfferDetails"]').should("have.length", numberOfCourses);
})