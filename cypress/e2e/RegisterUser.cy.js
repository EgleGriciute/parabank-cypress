/// <reference types="cypress"/>

const { faker } = require("@faker-js/faker");

describe("Register User", () => {

    beforeEach(() => {
        cy.visit("/register.htm");
    })

    it("should launch ${baseUrl}/register.htm after 'Register' on click ", () => {
        cy.visit("/");
        cy.get("#loginPanel > p > a[href='register.htm']").click();
        cy.url().should("contain", "/register.htm");
    });

    it("should return 'Welcome {firstname} {lastname}' and 'Welcome {username}' after successful registration", () => {
        cy.registerEndUser().then(() => {

            cy.fixture('sessionInfo.json').then((sessionInfo) => {

                const { userData } = sessionInfo;

                cy.visit("/register.htm");
                cy.get('body').should('be.visible');

                cy.get("#leftPanel > .smallText", { timeout: 10000 }).should("contain", `Welcome ${userData.firstName} ${userData.lastName}`);
            });
        });

    })

    it("should show register, even if all of the other fields belong to another user, except username field", () => {

        cy.registerEndUser().then(() => {

            cy.fixture("sessionInfo.json").then((sessionInfo) => {

                const { userData } = sessionInfo;

                cy.visit("/register.htm");

                cy.get("#customer\\.firstName").type(userData.firstName);
                cy.get("#customer\\.lastName").type(userData.lastName);
                cy.get("#customer\\.address\\.street").type(userData.address);
                cy.get("#customer\\.address\\.city").type(userData.city);
                cy.get("#customer\\.address\\.state").type(userData.state);
                cy.get("#customer\\.address\\.zipCode").type(userData.zipCode);
                cy.get("#customer\\.phoneNumber").type(userData.phoneNumber);
                cy.get("#customer\\.ssn").type(userData.ssn);
                cy.get("#customer\\.username").type(faker.internet.username());

                cy.get("#customer\\.password").type(userData.password);
                cy.get("#repeatedPassword").type(userData.password);

                cy.get("input[value='Register']").click();

                cy.get("#leftPanel > .smallText")
                    .should("contain", userData.firstName)
            })

        })
    })

    it("should show 'This username already exists.', if an existing user will attempt to register", () => {

        cy.registerEndUser().then(() => {
            cy.fixture("sessionInfo.json").then((sessionInfo) => {

                const { userData } = sessionInfo;

                cy.visit("/register.htm");

                cy.get("#customer\\.firstName").type(userData.firstName);
                cy.get("#customer\\.lastName").type(userData.lastName);
                cy.get("#customer\\.address\\.street").type(faker.location.streetAddress());
                cy.get("#customer\\.address\\.city").type(faker.location.city());
                cy.get("#customer\\.address\\.state").type(faker.location.state());
                cy.get("#customer\\.address\\.zipCode").type(faker.location.zipCode());
                cy.get("#customer\\.phoneNumber").type(faker.phone.number({ style: 'international' }));
                cy.get("#customer\\.ssn").type(faker.number.int(1000000000));
                cy.get("#customer\\.username").type(userData.username);
                cy.get("#customer\\.password").type(userData.password);
                cy.get("#repeatedPassword").type(userData.password);
                cy.get("input[value='Register']").click();

                cy.get("#customer\\.username\\.errors")
                    .should("exist")
                    .and("be.visible");
            })

        })
    })

    it("should return form validation error messages for all form fields after clicking on 'REGISTER' button", () => {
        cy.get("input[value='Register']").click();

        cy.get(".error").should("be.visible").each(($el) => {

            cy.wrap($el)
                .should("not.be.empty")
                .and("be.visible");
        });
    });

    it("should verify error messages disappear when fields are filled", () => {

        cy.registerEndUser();
        cy.get(".error:visible").should("not.exist");

    });

    it("should show repeated password does not match", () => {

        cy.get("#customer\\.firstName").type(faker.person.firstName());
        cy.get("#customer\\.lastName").type(faker.person.lastName());
        cy.get("#customer\\.address\\.street").type(faker.location.streetAddress());
        cy.get("#customer\\.address\\.city").type(faker.location.city());
        cy.get("#customer\\.address\\.state").type(faker.location.state());
        cy.get("#customer\\.address\\.zipCode").type(faker.location.zipCode())
        cy.get("#customer\\.phoneNumber").type(faker.phone.number({ style: 'international' }));
        cy.get("#customer\\.ssn").type(faker.number.int(1000000000));
        cy.get("#customer\\.username").type(faker.internet.username());
        cy.get("#customer\\.password").type(faker.internet.password());
        cy.get("#repeatedPassword").type(faker.internet.password());
        cy.get("input[value='Register']").click();

        cy.get("#repeatedPassword\\.errors")
            .should("exist")
            .and("be.visible");
    })
});