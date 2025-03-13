/// <reference types="cypress"/>

describe("Top Level Navigation Bugs", () => {

    it("should demonstrate, that tooltip 'ParaBank' is present, but not necessary", () => {

        cy.visit("/");

        cy.get(".logo")

            .trigger("mouseover")
            .should("have.attr", "title")
            .and("not.equal", "ParaBank");

        cy.get(".logo").should("have.css", "cursor", "pointer");
    });
});