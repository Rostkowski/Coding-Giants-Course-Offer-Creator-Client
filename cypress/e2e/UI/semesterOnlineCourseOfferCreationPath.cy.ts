import { courseKindsStub } from "../../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../../fixtures/coursesByPostCodeStub";
import { PTG1Dates } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Dates";
import { PTG1Description } from "../../fixtures/courses/SemesterOnlineCourses/PTG1/PTG1Description";
import { PZPDescription } from "../../fixtures/courses/SemesterOnlineCourses/PZP/PZPDescription";
import { PZPDates } from "../../fixtures/courses/SemesterOnlineCourses/PZP/PZPDates";

const semesterOnlineCoursesDescriptions = [PTG1Description, PZPDescription];
const semesterOnlineCoursesDates = [PTG1Dates, PZPDates];

describe("Tests offer generation for semester online courses", () => {
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
    semesterOnlineCoursesDescriptions.forEach(course => {
      cy.intercept(
        {
          method: "GET",
          url: `**/courses/${course.id}`,
        },
        course
      );
    });

    semesterOnlineCoursesDates.forEach(course => {
      cy.intercept({
        method: "GET",
        url: `**/timetablesByPostalCode/*/${course.courseId}/*/*`
      }, course);
    })

    cy.selectCountry("Poland");
    cy.selectCourseKind("Semestralne kursy z programowania (ONLINE)");
    cy.selectCourses(semesterOnlineCoursesDescriptions.map(course => course.name));
    cy.clickCoursesNextButton();

    semesterOnlineCoursesDescriptions.forEach(course => {
      cy.hasExactNumberOfLessonsInACourse(course.plan.length)
    });

    semesterOnlineCoursesDates.forEach(course => {
      cy.hasExactNumberOfAvailableDates(course.localisation.dates.length)
    });

    cy.hasExactNumberOfCoursesInOffer(semesterOnlineCoursesDescriptions.length);
  });
});
