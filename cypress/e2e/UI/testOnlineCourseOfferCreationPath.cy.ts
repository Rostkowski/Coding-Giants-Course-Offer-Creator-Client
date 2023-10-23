import { courseKindsStub } from "../../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../../fixtures/coursesByPostCodeStub";
import { PTG1Dates } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Dates";
import { PTG1Description } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Description";
import { PZPDescription } from "../../fixtures/courses/SemesterOnlineCourses/PZP/PZPDescription";
import { PZPDates } from "../../fixtures/courses/SemesterOnlineCourses/PZP/PZPDates";

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
        url: "**/courses/270",
      },
      PTG1Description
    ).as("PTG1Description");
    cy.intercept({
      method: "GET",
      url: "**/timetablesByPostalCode/*/270/*/*"
    }, PTG1Dates)
      .as("PTG1Dates")

      cy.intercept(
        {
          method: "GET",
          url: "**/courses/292",
        },
        PZPDescription
      ).as("PZPDescription");
      cy.intercept({
        method: "GET",
        url: "**/timetablesByPostalCode/*/292/*/*"
      }, PZPDates)
        .as("PZPDates")

    cy.generateOffer(
      "Poland",
      "Semestralne kursy z programowania (ONLINE)",
      [PTG1Description.name, PZPDescription.name]
    );
    cy.baseCourseOfferAssertions(18, 2)
  });
});
