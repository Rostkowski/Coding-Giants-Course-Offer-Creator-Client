import { courseKindsStub } from "../../fixtures/courseKindsStub";
import { semesterCoursesByPostCodeStub } from "../../fixtures/coursesByPostCodeStub";


describe("Test the select country functionality", () => {
    beforeEach(() => {
        cy.visit('/')
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
    })

    it("When clicking on select element with label 'select country' a list with with available countries should appear.", () => {
        cy.get("[data-cy='selectCountry']").get("option").should('have.text', '---PolandSpain');
    })

    it("When clicking on the '---' element inside select element with label 'select country' nothing should happen ", () => {
        cy.selectCountry("---");
        cy.get("[data-cy='selectCountry']").should('be.visible');
    })

    it("When clicking on the 'Poland' option inside select element with label 'select country' a new selectbox should appear", () => {
        cy.selectCountry("Poland");
        cy.get("[data-cy='selectCountry']").should('not.exist');
        cy.get("[data-cy='courseKinds']").should('exist').should('be.visible');
    })

    it("When clicking on the 'Spain' option inside select element with label 'select country' a new selectbox should appear", () => {
        cy.selectCountry("Spain");
        cy.get("[data-cy='selectCountry']").should('not.exist');
        cy.get("[data-cy='courseKinds']").should('exist').should('be.visible');
    })
})