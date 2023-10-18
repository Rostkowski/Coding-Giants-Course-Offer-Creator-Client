import { courseKindsStub } from "../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../fixtures/coursesByPostCodeStub";
import { onlineSemesterStub } from "../fixtures/onlineSemesterStub";

describe("Tests offer generation for online path", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept(
      {
        method: "GET",
        url: "courseKindsProgrammingType",
      },
      courseKindsStub
    ).as("courseKindStub");
    cy.intercept(
      {
        method: "GET",
        url: "**/coursesByPostCode/*/*",
      },
      semesterCoursesByPostCodeStub
    ).as("coursesByPostCodeStub");
  });

  it("generates a course offer for SEMESTER_ONLINE", () => {
    cy.intercept(
      {
        method: "GET",
        url: "**/courses/*",
      },
      onlineSemesterStub
    ).as("onlineSemesterStub");
    cy.generateOffer(
      "Poland",
      "Semestralne kursy z programowania (ONLINE)",
      onlineSemesterStub.name
    );
    cy.baseCourseOfferAssertions()
  });
});
