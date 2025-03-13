/// <reference types="cypress"/>

describe("Left Menu Bugs", () => {

    it("should have <a> tag inside of li element with a class 'Solutions', as it does not have it and cannot navigate back", () => {

        cy.visit("/");
        cy.get("li.Solutions").find("a").should("exist");

    });
});