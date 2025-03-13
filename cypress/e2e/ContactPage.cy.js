/// <reference types="cypress"/>

describe("Contact Page", () => {

    beforeEach(() => {
        cy.visit("/contact.htm");
    })

    it("should return success message after filling in contact form fields", () => {

        cy.get("input[value='Send to Customer Care']").click();

        const customerCareErrors = ["name", "email", "phone", "message"];

        customerCareErrors.forEach((item) => {

            cy.get(`#${item}`)
                .should("exist")
                .and("be.visible")
                .type("test")

            cy.get("input[value='Send to Customer Care']").click();

        })

        cy.get("#rightPanel p").eq(1).should("have.text", "A Customer Care Representative will be contacting you.");
    })

    it("should validate by showing error text messages after 'SEND TO CUSTOMER CARE' click", () => {

        cy.get("input[value='Send to Customer Care']").click();

        const customerCareErrors = [

            { selector: "name", error: "Name is required." },
            { selector: "email", error: "Email is required." },
            { selector: "phone", error: "hone is required." },
            { selector: "message", error: "Message is required." }
        ]

        customerCareErrors.forEach((item) => {

            cy.get(`span#${item.selector}\\.errors`)
                .should("exist")
                .and("be.visible")
                .and("contain", item.error)
        })

    });
});

