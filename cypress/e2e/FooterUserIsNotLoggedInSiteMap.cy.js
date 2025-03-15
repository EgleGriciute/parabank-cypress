/// <reference types="cypress"/>

describe("User Is Not Logged In Site Map - Footer Section", () => {

    beforeEach(() => {
        cy.visit("/sitemap.htm");
    })

    // Site Map navigations:

    it("should navigate 'Site Map' to '/sitemap.htm'", () => {
        cy.get("div#footerPanel > ul > li").eq(6).find("a").should("have.text", "Site Map").should("be.visible").click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/sitemap.htm`);
    })

    // Solutions:

    it("should navigate 'About Us' to '/about.htm'", () => {
        cy.get("ul.leftmenu > li").eq(1).click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/about.htm`)
    })

    it("should navigate 'Services' to '/services.htm'", () => {
        cy.get("ul.leftmenu > li").eq(2).click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/services.htm`)
    })

    it("should navigate 'Products' to https://www.parasoft.com/products/", () => {
        cy.get("#rightPanel > ul.leftmenu > li").eq(3).find("a").should("have.text", "Products").should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://www.parasoft.com", () => {
            cy.url().should("eq", "https://www.parasoft.com/products/");
        });
    })

    it("should navigate 'Locations' to https://www.parasoft.com/solutions/", () => {
        cy.get("#rightPanel > ul.leftmenu > li").eq(4).find("a").should("have.text", "Locations").should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://www.parasoft.com", () => {
            cy.url().should("eq", "https://www.parasoft.com/solutions/");
        });
    })

    it("should navigate 'Admin Page' to /admin.htm", () => {
        cy.get("#rightPanel > ul.leftmenu > li").eq(5).find("a").should("have.text", "Admin Page").should("be.visible").click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/admin.htm`);
    })

    // Account Services:

    it("should navigate 'Open New Account' to /openaccount.htm and return 'An internal error has occurred and has been logged.'", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(0).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/openaccount.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");

    })

    it("should navigate 'Accounts Overview' to /overview.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(1).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/overview.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should navigate 'Transfer Funds' to /transfer.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(2).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/transfer.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should navigate 'Bill Pay' to /billpay.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(3).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/billpay.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should navigate 'Find Transactions' to /findtrans.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(4).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/findtrans.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should navigate 'Update Contact Info' to /updateprofile.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(5).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/updateprofile.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should navigate 'Request Loan' to /requestloan.htm", () => {
        cy.get("#rightPanel > ul").eq(1).find("li").eq(6).children().click();
        cy.url().should("contain", `${Cypress.config("baseUrl")}/requestloan.htm`);

        cy.get("#rightPanel p.error").should("have.text", "An internal error has occurred and has been logged.");
    })

    it("should launch copyright hyperlink to https://www.parasoft.com/", () => {
        cy.get("#footerPanel > ul").eq(1).find("a").click();
    })

});
