import { courseKindsStub } from "../../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../../fixtures/coursesByPostCodeStub";
import { PTG1Dates } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Dates";
import { PTG1Description } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Description";

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
    cy.generateOffer(
      "Poland",
      "Semestralne kursy z programowania (ONLINE)",
      PTG1Description.name
    );
    cy.baseCourseOfferAssertions(18, 2)
  });
});
