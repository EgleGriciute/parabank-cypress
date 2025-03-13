/// <reference types="cypress"/>

describe("Transfer Funds Page", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.openNewAccount("SAVINGS");
        cy.visit("/transfer.htm");
    })

    it("should transfer money successfully if different 'From account' and 'To account' options are selected", () => {

        cy.get("input#amount")
            .should('be.visible')
            .clear()
            .type("100");

        cy.get("select#fromAccountId")
            .should('be.visible')
            .select(0);

        cy.get("select#toAccountId")
            .should('be.visible')
            .select(1);

        cy.get("input[value='Transfer']").click();

        cy.contains("Transfer Complete").should("be.visible");
    });

    it("should return 'Error! An internal error has occurred and has been logged.' after filling in a space character as amount", () => {

        cy.get("input#amount")
            .should('be.visible')
            .clear()
            .type(" ");


        cy.get("select#fromAccountId")
            .should('be.visible')
            .select(0);

        cy.get("select#toAccountId")
            .should('be.visible')
            .select(0);

        cy.get("input[value='Transfer']").click();

        cy.get("div#showError > h1.title").should("contain", "Error!");
        cy.get("div#showError > p.error").should("contain", "An internal error has occurred and has been logged.");

    })


    it("should return 'Error! An internal error has occurred and has been logged.' after filling in a string as amount", () => {

        cy.get("input#amount")
            .should('be.visible')
            .clear()
            .type("test");


        cy.get("select#fromAccountId")
            .should('be.visible')
            .select(0);

        cy.get("select#toAccountId")
            .should('be.visible')
            .select(0);

        cy.get("input[value='Transfer']").click();

        cy.get("div#showError > h1.title").should("contain", "Error!");
        cy.get("div#showError > p.error").should("contain", "An internal error has occurred and has been logged.");

    })

});



