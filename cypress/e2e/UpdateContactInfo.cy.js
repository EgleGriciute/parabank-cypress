/// <reference types="cypress"/>

describe("Update Contact Info", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.visit("/updateprofile.htm");
    })

    it("should navigate to ${baseUrl}/updateprofile.htm after click", () => {

        cy.visit("/overview.htm");
        cy.get("a[href='updateprofile.htm']").click();
        cy.url().should("contain", "/updateprofile.htm");

    });

    it("should initially store end-user contact information details", () => {

        const profileInformationDetails = [
            { info: "First Name", input: "customer.firstName" },
            { info: "Last Name", input: "customer.lastName" },
            { info: "Address", input: "customer.address.street" },
            { info: "City", input: "customer.address.city" },
            { info: "State", input: "customer.address.state" },
            { info: "Zip Code", input: "customer.address.zipCode" },
            { info: "Phone #", input: "customer.phoneNumber" },

        ]

        profileInformationDetails.forEach((item) => {
            cy.get("table.form2 > tbody > tr").should("contain", item.info);
            cy.get(`#${item.input}`).should("not.be.empty");
        });

    })

    it("should update end-user contact information", () => {

        cy.get("input#customer\\.address\\.state").clear().type("Updated State");
        cy.get("input[value='Update Profile']").click();

        cy.get("div#updateProfileResult h1").should("have.text", "Profile Updated");
    })

    it("should render error messages for required fields if not filled in", () => {

        const profileInformationDetails = [
            { info: "First Name", input: "customer.firstName", error: "First name is required." },
            { info: "Last Name", input: "customer.lastName", error: "Last name is required." },
            { info: "Address", input: "customer.address.street", error: "Address is required." },
            { info: "City", input: "customer.address.city", error: "City is required." },
            { info: "State", input: "customer.address.state", error: "State is required." },
            { info: "Zip Code", input: "customer.address.zipCode", error: "Zip Code is required." },
            { info: "Phone #", input: "customer.phoneNumber", hasError: false }
        ];

        // Wait for the form to fully load:
        cy.wait(1000);

        // Clear all fields:
        cy.wrap(profileInformationDetails).each((item) => {
            cy.get(`input#${item.input.replace(/\./g, '\\.')}`).clear().blur();
        });

        cy.get("input[value='Update Profile']").click();

        cy.wrap(profileInformationDetails).each((item) => {
            if (item.hasError === false) {
                cy.get("table.form2").should("not.contain", "Phone number is required.");
            } else {
                cy.get("table.form2").should("contain", item.error);
            }
        });
    });
});
