/// <reference types="cypress"/>

describe("Accounts Overview", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
        cy.loginWithRegisteredUser();
    })

    beforeEach(() => {
        cy.visit("/overview.htm");
    })

    it("should launch 'Accounts Overview' after login and left menu click and render: 'Account', 'Balance', 'Available Amount' values", () => {

        cy.visit("/");
        cy.get("a[href='overview.htm']").click();
        cy.url().should("contain", "overview.htm");

        // Account:
        cy.get("table#accountTable tbody>tr>td").eq(0).should("not.be.empty").invoke("text").then((accountId) => {
            cy.get("table#accountTable tbody>tr>td>a").eq(0)
                .should("have.attr", "href", `activity.htm?id=${accountId.trim()}`);
        });

        // Balance:
        cy.get("table#accountTable tbody>tr>td").eq(1)
            .should("exist")
            .and("not.be.empty")
            .and("be.visible");

        // Available Amount:
        cy.get("table#accountTable tbody>tr>td").eq(2)
            .should("exist")
            .and("not.be.empty")
            .and("be.visible");
    });

});
