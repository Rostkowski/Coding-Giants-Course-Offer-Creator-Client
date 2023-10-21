export {};

declare global {
  namespace Cypress {
    interface Chainable {
      generateOffer(country: string, courseKind: string, courseName: string): Chainable<JQuery<HTMLElement>>;
      getTinyMCEIframeBody(): Cypress.Chainable<any>;
      baseCourseOfferAssertions(numberOfLessons: number, numberOfAvailableDates: number): Chainable<JQuery<HTMLElement>>;
    }
  }
}