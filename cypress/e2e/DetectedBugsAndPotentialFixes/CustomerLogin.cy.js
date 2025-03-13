/// <reference types="cypress"/>

describe("Customer Login Bugs", () => {
    it("should not login end-user after filling in space character as Username & Password", () => {
        cy.visit("/");

        cy.get("input[name='username']").clear().type(" ");
        cy.get("input[name='password']").clear().type(" ").type("{enter}");

        cy.url().should("eq", Cypress.config("baseUrl"));
    });
});
