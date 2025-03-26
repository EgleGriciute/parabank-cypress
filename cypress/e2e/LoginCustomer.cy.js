/// <reference types="cypress"/>

describe("Customer Login", () => {

    beforeEach(() => {
        cy.visit("/");
    })

    it("should login with correct credentials: username and password", () => {
        cy.loginWithRegisteredUser();
    });

    it("should return 'Error! Please enter a username and password.' after leaving input fields empty", () => {

        cy.get("input[value='Log In']").click();
        cy.get("#rightPanel h1.title")
            .should("exist")
            .and("be.visible")
            .and("contain", "Error!");
        cy.get("#rightPanel p.error")
            .should("exist")
            .and("be.visible")
            .and("contain", "Please enter a username and password.");
    })

    it("should return 'Error! Please enter a username and password.' if username is filled but password is empty", () => {

        cy.fixture("sessionInfo.json").then((sessionInfo) => {
            const { userData } = sessionInfo;

            cy.get("input[name='username']").type(userData.username);
            cy.get("input[value='Log In']").click();

            cy.get("#rightPanel h1.title")
                .should("exist")
                .and("be.visible")
                .and("contain", "Error!");

            cy.get("#rightPanel p.error")
                .should("exist")
                .and("be.visible")
                .and("contain", "Please enter a username and password.");

        });
    });

    it("should return 'Error! Please enter a username and password.' if password is filled but username is empty", () => {

        cy.fixture("sessionInfo.json").then((sessionInfo) => {
            const { userData } = sessionInfo;

            cy.get("input[name='password']").type(userData.password);
            cy.get("input[value='Log In']").click();


            cy.get("#rightPanel h1.title")
                .should("exist")
                .and("be.visible")
                .and("contain", "Error!");
            cy.get("#rightPanel p.error")
                .should("exist")
                .and("be.visible")
                .and("contain", "Please enter a username and password.");
        });
    });

    it("should return 'Error! The username and password could not be verified.', if username and password fields are not being recognised", () => {

        cy.get("input[name='username']").type("fakeUser");
        cy.get("input[name='password']").type("fakePassword");
        cy.get("input[value='Log In']").click();

        cy.get("#rightPanel h1.title")
            .should("exist")
            .and("be.visible")
            .and("contain", "Error!");

        cy.get("#rightPanel p.error")
            .should("exist")
            .and("be.visible")
            .and("contain", "The username and password could not be verified.");

    })

})

