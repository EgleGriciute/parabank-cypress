/// <reference types="cypress"/>

describe("Register User", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.visit("/openaccount.htm");
    });

    it("should open a new 'CHECKING' account after 'OPEN NEW ACCOUNT' click and route to ${baseUrl}/activity.htm?id=${bankAccountNumber}", () => {
        cy.openNewAccount("CHECKING");
    });

    it("should open a new 'SAVINGS' account after 'OPEN NEW ACCOUNT' click and route to ${baseUrl}/activity.htm?id=${bankAccountNumber}", () => {
        cy.openNewAccount("SAVINGS");
    });

    it("should render in 'Account Details' selected type as 'Account Type': 'CHECKING'", () => {
        cy.openNewAccount("CHECKING");
        cy.get("#accountType").should("have.text", "CHECKING");
    })

    it("should render in 'Account Details' selected type as 'Account Type': 'SAVINGS'", () => {
        cy.openNewAccount("SAVINGS");
        cy.get("#accountType").should("have.text", "SAVINGS");
    })

    it("should filter by month according to initial account creation. As well, type should be set to 'Credit', as amount gets populated with $100.00 as per default", () => {

        cy.openNewAccount("SAVINGS");

        cy.getTodaysDateMonth().then((item) => {

            const allMonthSelections = [
                { selector: "January", date: "01" },
                { selector: "February", date: "02" },
                { selector: "March", date: "03" },
                { selector: "April", date: "04" },
                { selector: "May", date: "05" },
                { selector: "June", date: "06" },
                { selector: "July", date: "07" },
                { selector: "August", date: "08" },
                { selector: "September", date: "09" },
                { selector: "October", date: "10" },
                { selector: "November", date: "11" },
                { selector: "December", date: "12" },
            ];

            // Find the month name that matches the current date's month number:
            const selectedMonth = allMonthSelections.find(month => month.date === item);

            if (selectedMonth) {
                cy.get("select#month").select(selectedMonth.selector);
            } else {
                throw new Error(`Month with value ${item} not found in selection list.`);
            }
        });

        cy.get("#transactionType").select("Credit");
        cy.get("#transactionTable > tbody > tr > td").eq(3).should("contain", "$100.00");
    });


    it("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'SAVINGS 'account creation", () => {
        cy.openNewAccount("SAVINGS");
        cy.get("#transactionType").select("Debit");
        cy.get("input[value='Go']").click();

        cy.get("#noTransactions b").should("have.text", "No transactions found.");
    });

    it("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'CHECKING 'account creation", () => {
        cy.openNewAccount("CHECKING");
        cy.get("#transactionType").select("Debit");
        cy.get("input[value='Go']").click();

        cy.get("#noTransactions b").should("have.text", "No transactions found.");
    });

    it("should have a correctly rendered 'Date' after account creation", () => {
        cy.openNewAccount("SAVINGS");
        cy.getTodaysDateDashFormat().then((item) => {

            cy.get("#transactionTable > tbody > tr > td").eq(0).should("contain", item);
        });
    })

    it("should launch 'Funds Transfer Received' hyperlink and naviagte to: ${baseUrl}transaction.htm?id=${transcationId}", () => {
        cy.openNewAccount("SAVINGS");
        cy.get("a").contains("Funds Transfer Received").click();

        cy.get("#rightPanel > table > tbody > tr > td").eq(1).invoke("text").then((item) => {

            cy.url().should("eq", `${Cypress.config("baseUrl")}/transaction.htm?id=${item}`);
        })
    })

    it("should have a newly opened 'SAVINGS' account value set to Credit(+) of $100.00", () => {
        cy.openNewAccount("SAVINGS");
        cy.get("#transactionTable > tbody > tr > td").eq(3).should("contain", "$100.00");
    })

    it("should have a newly opened 'CHECKING' account value set to Credit(+) of $100.00", () => {
        cy.openNewAccount("CHECKING");
        cy.get("#transactionTable > tbody > tr > td").eq(3).should("contain", "$100.00");
    })

})