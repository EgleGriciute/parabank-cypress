/// <reference types="cypress"/>

describe("User Is Logged In - Footer Section", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
    })

    it("should navigate 'Home', 'About US', 'Services' to corresponding pages", () => {

        const pageNavigation = [

            { listIndex: 0, urlText: "Home", url: "index.htm" },
            { listIndex: 1, urlText: "About Us", url: "about.htm" },
            { listIndex: 2, urlText: "Services", url: "services.htm" }
        ]

        cy.wrap(pageNavigation).each((item) => {

            cy.get("div#footerPanel > ul > li").eq(`${item.listIndex}`).find("a").should("have.text", `${item.urlText}`).click();
            cy.url().should("eq", `${Cypress.config("baseUrl")}/${item.url}`);
        })
    })

    it("should navigate 'Products' to https://www.parasoft.com/products/", () => {
        cy.get("div#footerPanel > ul > li").eq(3).find("a").should("have.text", "Products").should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://www.parasoft.com", () => {
            cy.url().should("eq", "https://www.parasoft.com/products/");
        });
    })

    it("should navigate 'Locations' to 'https://www.parasoft.com/solutions/'", () => {
        cy.get("div#footerPanel > ul > li").eq(4).find("a").should("have.text", "Locations").should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://www.parasoft.com", () => {
            cy.url().should("eq", "https://www.parasoft.com/solutions/");
        });

    });

    it("should navigate 'Forum' to 'https://forums.parasoft.com/'", () => {
        cy.get("div#footerPanel > ul > li").eq(5).find("a").should("have.text", "Forum").should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://forums.parasoft.com", () => {
            cy.url().should("eq", "https://forums.parasoft.com/");
        });
    })

    it("should navigate 'Contact Us' to '/sitemap.htm'", () => {
        cy.get("div#footerPanel > ul > li").eq(7).find("a").should("have.text", "Contact Us").should("be.visible").click();
        cy.url().should("eq", `${Cypress.config("baseUrl")}/contact.htm`);
    })

});
