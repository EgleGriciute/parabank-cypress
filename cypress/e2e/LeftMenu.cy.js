/// <reference types="cypress"/>

describe("Left menu", () => {

    beforeEach(() => {
        cy.loadHomePageSuccessfully();
    })

    it("should show 'Solutions' as set to a default page: baseUrl (not clickable)", () => {
        cy.get(".Solutions").should("not.have.css", "cursor", "pointer");
    })

    it("should navigate 'About Us' to: ${baseUrl}/about.htm", () => {

        cy.get(".leftmenu> li> a[href='about.htm']").click();
        cy.url().should("contain", "/about.htm");

        cy.get("#rightPanel > h1").should("have.text", "ParaSoft Demo Website");
        cy.get("#rightPanel> p> a[href='http://www.parasoft.com/']")
            .should("exist")
            .and("be.visible")
            .and("not.be.disabled");
    })

    it("should navigate 'Services' to: ${baseUrl}/services.htm", () => {

        cy.get(".leftmenu > li > a[href='services.htm']").click();
        cy.url().should("contain", "/services.htm");

        cy.get("span.heading").each(($element) => {

            cy.wrap($element).should('be.visible');
            cy.wrap($element).invoke("text").should("not.be.empty");

        });
    });

    it("should navigate 'Products' to: ${parasoftExternalUrl}/products/", () => {

        cy.get(".leftmenu > li > a[href='http://www.parasoft.com/jsp/products.jsp']")
            .should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        // Use `cy.origin()` to interact with the external domain:
        cy.origin("https://www.parasoft.com", () => {
            // Verify the correct external URL:
            cy.url().should("eq", "https://www.parasoft.com/products/");
        });
    });

    it("should navigate 'Locations' to: ${parasoftExternalUrl}/solutions/", () => {
        cy.get(".leftmenu > li> a[href='http://www.parasoft.com/jsp/pr/contacts.jsp']")

            .should("be.visible")
            .then(($link) => {
                const targetUrl = $link.prop("href");
                cy.visit(targetUrl);
            });

        cy.origin("https://www.parasoft.com", () => {
            cy.url().should("eq", "https://www.parasoft.com/solutions/");
        })
    })

    it("should navigate 'Admin Page' to ${baseUrl}/admin.htm", () => {
        cy.get(".leftmenu > li > a[href='admin.htm']").click();
        cy.url().should("contain", "/admin.htm")
    })

});
