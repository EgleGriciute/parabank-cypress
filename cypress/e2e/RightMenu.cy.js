/// <reference types="cypress"/>

describe("Right Menu", () => {

    beforeEach(() => {
        cy.loadHomePageSuccessfully();
    })

    it("should navigate 'Home' button to baseUrl on a click", () => {
        cy.get("ul.button li.home").click();
        cy.url().should("contain", "/")
    })

    it("should navigate 'About' button to ${baseUrl}/about.htm on a click", () => {
        cy.get("ul.button li.aboutus").click();
        cy.url().should("contain", "/about.htm")
    })

    it("should navigate 'Contact' button to ${baseUrl}/contact.htm on a click", () => {
        cy.get("ul.button li.contact").click();
        cy.url().should("contain", "/contact.htm")
    })

});
