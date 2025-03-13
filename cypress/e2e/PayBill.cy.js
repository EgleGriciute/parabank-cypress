/// <reference types="cypress"/>

describe("Pay Bill", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.openNewAccount("CHECKING");
        cy.visit("/billpay.htm");

    })

    it("should navigate to ${baseUrl}/billpay.htm after 'Bill Pay' click", () => {
        cy.visit("/overview.htm");
        cy.get("a[href='billpay.htm']").click();
        cy.url().should("eq", `${Cypress.config("baseUrl")}/billpay.htm`);
        cy.get("div#billpayForm h1").should("have.text", "Bill Payment Service");
    });

    it("should transfer payment to payee after filling in payment information and render 'Bill Payment Complete'", () => {

        const payeeInformation = [

            { selector: 'payee.name', info: "Receiver" },
            { selector: 'payee.address.street', info: "Receiver Address" },
            { selector: 'payee.address.city', info: "Receiver City" },
            { selector: 'payee.address.state', info: "Receiver State" },
            { selector: 'payee.address.zipCode', info: "Receiver zipCode" },
            { selector: 'payee.phoneNumber', info: "Receiver phone" },
            { selector: 'payee.accountNumber', info: "99999" },
            { selector: 'verifyAccount', info: "99999" },
            { selector: 'amount', info: "1" }
        ]

        payeeInformation.forEach((input) => {
            cy.get(`input[name='${input.selector}']`).type(`${input.info}`);
        })

        cy.get("input[value='Send Payment']").click();
        cy.get("#billpayResult h1").should("have.text", "Bill Payment Complete");

    });

    it("should validate each form table field after 'SEND PAYMENT' click", () => {

        cy.get("input[value='Send Payment']").click();

        const payeeInformationValidationErrors = [

            { selector: "name", message: "Payee name is required." },
            { selector: "address", message: "Address is required." },
            { selector: "city", message: "City is required." },
            { selector: "state", message: "State is required." },
            { selector: "zipCode", message: "Zip Code is required." },
            { selector: "phoneNumber", message: "Phone number is required." },
            { selector: "account-empty", message: "Account number is required." },
            { selector: "verifyAccount-empty", message: "Account number is required." },
            { selector: "amount-empty", message: "The amount cannot be empty. " },
        ]

        payeeInformationValidationErrors.forEach((error) => {
            cy.get(`span#validationModel-${error.selector}`).should("have.text", `${error.message}`);
        })

    });


    it("should validate fields 'Account #', 'Verify Account #', 'Amount: $' and only numeric values may pass", () => {

        const payeeInformation = [
            { selector: 'payee.name', info: "Receiver" },
            { selector: 'payee.address.street', info: "Receiver Address" },
            { selector: 'payee.address.city', info: "Receiver City" },
            { selector: 'payee.address.state', info: "Receiver State" },
            { selector: 'payee.address.zipCode', info: "Receiver zipCode" },
            { selector: 'payee.phoneNumber', info: "Receiver phone" },
        ];

        payeeInformation.forEach((input) => {
            cy.get(`input[name='${input.selector}']`)
                .should("be.visible")
                .clear()
                .type(`${input.info}`);
        });

        const invalidInputs = ["test", "😀", "@#$%"];

        invalidInputs.forEach((invalidValue) => {
            cy.get("input[name='payee.accountNumber']")
                .should("be.visible")
                .clear()
                .type(invalidValue);
            cy.get("input[name='verifyAccount']")
                .should("be.visible")
                .clear()
                .type(invalidValue);
            cy.get("input[name='amount']")
                .should("be.visible")
                .clear()
                .type(invalidValue);

            cy.get("input[value='Send Payment']").click();


            cy.get("span#validationModel-account-invalid")
                .should("be.visible")
                .and("have.text", "Please enter a valid number.");

            cy.get("span#validationModel-verifyAccount-invalid")
                .should("be.visible")
                .and("have.text", "Please enter a valid number.");

            cy.get("span#validationModel-amount-invalid")
                .should("be.visible")
                .and("have.text", "Please enter a valid amount.");
        });
    });

});




