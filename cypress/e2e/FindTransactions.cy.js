/// <reference types="cypress"/>

describe("Find Transactions", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.openNewAccount("CHECKING");
        cy.visit("/findtrans.htm");
    })

    it("should navigate to ${baseUrl}/findtrans.htm after 'Find Transactions' click", () => {

        cy.visit("/overview.htm");
        cy.get("a[href='findtrans.htm']").click();
        cy.get("#formContainer h1").should("contain", "Find Transactions");

    });

    it("should 'Find by Transaction ID' after 'FIND TRANSACTIONS' click", () => {

        // Account needs to have at least 1 existing transfer:
        cy.transferToAccount();
        cy.visit("/overview.htm");

        // Select first account and perform transaction validation check:
        cy.get('#accountTable > tbody > tr > td').eq(0).invoke("text").then((accountNumber) => {

            // Click on a first transaction:
            cy.get(`a[href='activity.htm?id=${accountNumber}']`).click();

            // Perform transaction URL check:
            cy.url().should("eq", `${Cypress.config("baseUrl")}/activity.htm?id=${accountNumber}`)
            cy.get("#accountId").should("have.text", accountNumber);

            cy.get("#transactionTable > tbody > tr > td").eq(1).should("be.visible").click();

            // Retrieve 'Transaction ID' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find By Transaction ID':
            cy.get("#rightPanel > table > tbody > tr").eq(0).find("td").eq(1).invoke("text").then((item) => {

                cy.get("a[href='findtrans.htm']").click();
                cy.get("input#transactionId").type(item);
                cy.get("button#findById").click();
            })
        })

        // As it is a known bug, it does return 'An internal error has occurred and has been logged.':
        cy.get("#errorContainer p.error").should("contain", "An internal error has occurred and has been logged.");

    })

    it("should 'Find by Date' after 'FIND TRANSACTIONS' click", () => {

        // Account needs to have at least 1 existing transfer:
        cy.transferToAccount();
        cy.visit("/overview.htm");

        // Select first account and perform transaction validation check:
        cy.get('#accountTable > tbody > tr > td').eq(0).invoke("text").then((accountNumber) => {

            // Click on a first transaction:
            cy.get(`a[href='activity.htm?id=${accountNumber}']`).click();

            // Perform transaction URL check:
            cy.url().should("eq", `${Cypress.config("baseUrl")}/activity.htm?id=${accountNumber}`)
            cy.get("#accountId").should("have.text", accountNumber);

            cy.get("#transactionTable > tbody > tr > td").eq(1).should("be.visible").click();

            // Retrieve 'Transaction ID' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Date':
            cy.get("#rightPanel > table > tbody > tr").eq(1).find("td").eq(1).invoke("text").then((date) => {

                cy.get("a[href='findtrans.htm']").click();
                cy.get("#transactionDate").type(date);
                cy.get("button#findByDate").click();

                cy.get("#transactionBody").children().should("contain", date);
            })
        })
    })

    it("should 'Find by Date Range' after 'FIND TRANSACTIONS' click", () => {

        // Account needs to have at least 1 existing transfer:
        cy.transferToAccount();
        cy.visit("/overview.htm");

        // Select first account and perform transaction validation check:
        cy.get('#accountTable > tbody > tr > td').eq(0).invoke("text").then((accountNumber) => {

            // Click on a first transaction:
            cy.get(`a[href='activity.htm?id=${accountNumber}']`).click();

            // Perform transaction URL check:
            cy.url().should("eq", `${Cypress.config("baseUrl")}/activity.htm?id=${accountNumber}`)
            cy.get("#accountId").should("have.text", accountNumber);

            cy.get("#transactionTable > tbody > tr > td").eq(1).should("be.visible").click();

            // Retrieve 'Transaction ID' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Date Range':
            cy.get("#rightPanel > table > tbody > tr").eq(1).find("td").eq(1).invoke("text").then((date) => {

                cy.get("a[href='findtrans.htm']").click();
                cy.get("input#fromDate").type(date);
                cy.get("input#toDate").type(date);
                cy.get("button#findByDateRange").click();

                cy.get("#transactionBody").children().should("contain", date);
            })
        })

    });

    it("should 'Find by Amount' after 'FIND TRANSACTIONS' click", () => {

        // Account needs to have at least 1 existing transfer:
        cy.transferToAccount();
        cy.visit("/overview.htm");

        // Select first account and perform transaction validation check:
        cy.get('#accountTable > tbody > tr > td').eq(0).invoke("text").then((accountNumber) => {

            // Click on a first transaction:
            cy.get(`a[href='activity.htm?id=${accountNumber}']`).click();

            // Perform transaction URL check:
            cy.url().should("eq", `${Cypress.config("baseUrl")}/activity.htm?id=${accountNumber}`)
            cy.get("#accountId").should("have.text", accountNumber);

            cy.get("#transactionTable > tbody > tr > td").eq(1).should("be.visible").click();

            // Retrieve 'Transaction ID' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Amount':
            cy.get("#rightPanel > table > tbody > tr").eq(4).find("td").eq(1).invoke("text").then((amount) => {

                cy.get("a[href='findtrans.htm']").click();

                const modifiedAmount = amount.startsWith("$") ? amount.slice(1) : amount;

                cy.get("input#amount").type(modifiedAmount);
                cy.get("button#findByAmount").click();

                cy.get("#transactionTable").children().should("contain", modifiedAmount);
            })
        })
    })

});


