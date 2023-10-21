import { courseKindsStub } from "../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../fixtures/coursesByPostCodeStub";
import { onlineSemesterStub, onlineSemesterStubForDates } from "../fixtures/onlineSemesterStub";

const today = new Date();

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
    cy.intercept({
      method: "GET",
      url: "**/timetablesByPostalCode/*/*/*/*"
    }, onlineSemesterStubForDates(today))
      .as("onlineSemesterStubForDates")
    cy.generateOffer(
      "Poland",
      "Semestralne kursy z programowania (ONLINE)",
      onlineSemesterStub.name
    );
    cy.baseCourseOfferAssertions(18, 2)
  });
});
