export {};

declare global {
  namespace Cypress {
    interface Chainable {
      selectCountry(country: string): Chainable<JQuery<HTMLElement>>;
      openCountrySelectElement(): Chainable<JQuery<HTMLElement>>;
      selectCourseKind(courseKind: string): Chainable<JQuery<HTMLElement>>
      selectCourses(courses: string[]): Chainable<JQuery<HTMLElement>>
      clickCoursesNextButton(): Chainable<JQuery<HTMLElement>>
      getTinyMCEIframeBody(): Cypress.Chainable<any>;
      hasExactNumberOfAvailableDates(numberOfAvailableDates: number): Chainable<JQuery<HTMLElement>>;
      hasExactNumberOfLessonsInACourse(numberOfLessons: number): Chainable<JQuery<HTMLElement>>;
      hasExactNumberOfCoursesInOffer(numberOfCourses: number): Chainable<JQuery<HTMLElement>>;
    }
  }
}
