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
