/// <reference types="cypress"/>

describe("Forgot login info", () => {

    beforeEach(() => {
        cy.visit("/lookup.htm");
    })

    it("should return ${baseUrl}/lookup.htm after 'Find my login info' click", () => {

        cy.visit("/");
        cy.get("#loginPanel p > a[href='lookup.htm']").click();

        cy.url().should("contain", "/lookup.htm")
    })

    it("should result in 'Your login information was located successfully. You are now logged in.' and render 'Username' and 'Password' after a successful form submission", () => {

        cy.fixture("sessioninfo.json").then((sessioninfo) => {

            const { userData } = sessioninfo;
            cy.get("input#firstName").type(userData.firstName);
            cy.get("input#lastName").type(userData.lastName);
            cy.get("input#address\\.street").type(userData.address);
            cy.get("input#address\\.city").type(userData.city);
            cy.get("input#address\\.state").type(userData.state);
            cy.get("input#address\\.zipCode").type(userData.zipCode);
            cy.get("input#ssn").type(userData.ssn);

            cy.get("input[value='Find My Login Info']").click();

            cy.get("#rightPanel > p").should("contain", "Your login information was located successfully. You are now logged in.");

            cy.get("#rightPanel p").should("contain", userData.username);
            cy.get("#rightPanel p").should("contain", userData.password);

        })
    })

    it("should return form validation error messages after clicking on 'Find my login info'", () => {

        cy.get("input[value='Find My Login Info']").click();

        const errorMessages = [
            { id: "firstName", message: "First name is required." },
            { id: "lastName", message: "Last name is required." },
            { id: "address\\.street", message: "Address is required." },
            { id: "address\\.city", message: "City is required." },
            { id: "address\\.state", message: "State is required." },
            { id: "address\\.zipCode", message: "Zip Code is required." },
            { id: "ssn", message: "Social Security Number is required." }
        ];

        errorMessages.forEach(({ id, message }) => {
            cy.get(`span#${id}\\.errors`)
                .should("exist")
                .and("be.visible")
                .and("contain", message);
        });
    });

    it("should return 'Error! The customer information provided could not be found.' after filling in invalid data", () => {

        cy.fixture("sessioninfo.json").then((sessioninfo) => {

            const { userData } = sessioninfo;
            cy.get("input#firstName").type("test");
            cy.get("input#lastName").type("test");
            cy.get("input#address\\.street").type("test");
            cy.get("input#address\\.city").type("test");
            cy.get("input#address\\.state").type("test");
            cy.get("input#address\\.zipCode").type("test");
            cy.get("input#ssn").type("test");

            cy.get("input[value='Find My Login Info']").click();

            cy.get("#rightPanel p.error")
                .should("contain", "The customer information provided could not be found.");

        })
    })

});


