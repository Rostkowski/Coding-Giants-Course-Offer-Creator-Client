export {};

declare global {
  namespace Cypress {
    interface Chainable {
      generateOffer(country: string, courseKind: string, courseName: string): Chainable<JQuery<HTMLElement>>;
      getTinyMCEIframeBody(): Cypress.Chainable<unknown>;
      baseCourseOfferAssertions(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
