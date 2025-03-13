/// <reference types="cypress"/>

describe("Top Level Navigation", () => {

    beforeEach(() => {
        cy.loadHomePageSuccessfully();
    })

    it("should launch ${baseUrl}/admin.htm after square logo click", () => {
        cy.get("img.admin").click();
        cy.url().should("include", "/admin.htm");
    })

    it("should navigate to baseUrl after 'PARA BANK' logo click", () => {
        cy.get(".logo").click();
        cy.url().should("include", "/")
    })

})