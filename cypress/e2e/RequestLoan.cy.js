/// <reference types="cypress"/>

describe("Request Loan", () => {

    before(() => {
        cy.registerEndUser();
        cy.logOut();
    })

    beforeEach(() => {
        cy.loginWithRegisteredUser();
        cy.visit("/requestloan.htm");
    })

    it("should navigate to ${baseUrl}/requestloan.htm after click", () => {
        cy.visit("/");
        cy.get("a[href='requestloan.htm']").click();
    });

    it("should apply for a loan successfully after 'APPLY NOW' click", () => {

        // Retrieve bank account value from select option and extract the account ID:
        cy.get("select#fromAccountId option").then(($option) => {


            // Navigate to 'Accounts Overview' and retrieve selected account's available balance:
            cy.visit("/overview.htm");
            cy.get('#accountTable > tbody > tr > td').eq(0).find("a").click();

            cy.wait(1000);

            cy.url().then(() => {
                cy.url().should("include", "/activity.htm?id=");
            });

            cy.get("#accountDetails > table > tbody > tr").eq(3).find("td#availableBalance")
                .invoke("text").then((availableBalance) => {

                    // Modified balance parsing - handle currency symbols and commas:
                    const refactoredAvailableBalance = parseFloat(availableBalance.replace(/[$,]/g, ""));

                    // Ensure the balance is retrieved correctly:
                    expect(refactoredAvailableBalance).to.be.a("number");
                    expect(refactoredAvailableBalance).to.be.greaterThan(0);

                    // Navigate to loan request page:
                    cy.visit("/requestloan.htm");

                    // Enter loan details:
                    cy.get("input#amount").type("1000");
                    cy.get("input#downPayment").type("150");

                    // Retrieve downPayment value and assert it's not greater than available balance:
                    cy.get("input#downPayment").invoke("val").then((downPaymentValue) => {
                        cy.log(`Down Payment Entered: ${downPaymentValue}`);

                        // Ensure downPaymentValue is correctly parsed:
                        const parsedDownPayment = parseFloat(downPaymentValue);

                        expect(parsedDownPayment).to.be.a("number");
                        expect(parsedDownPayment).to.be.at.most(refactoredAvailableBalance);
                    });

                    // Submit the loan application:
                    cy.get("input[value='Apply Now']").click();
                    cy.get("#loanRequestApproved").should("contain", "Congratulations, your loan has been approved.");

                });
        });
    });

    it("should return 'You do not have sufficient funds for the given down payment.' if there is not enough balance", () => {

        // Retrieve bank account value from select option and extract the account ID:
        cy.get("select#fromAccountId option").then(() => {

            // Navigate to 'Accounts Overview' and retrieve selected account's available balance:
            cy.visit("/overview.htm");
            cy.get('#accountTable > tbody > tr > td').eq(0).find("a").click();

            cy.wait(1000);

            cy.url().then((url) => {
                cy.log(`Current URL: ${url}`);
                cy.url().should("include", "/activity.htm?id=");
            });

            cy.get("#accountDetails > table > tbody > tr").eq(3).find("td#availableBalance")
                .invoke("text").then((availableBalance) => {

                    // Modified balance parsing - handle currency symbols and commas:
                    const refactoredAvailableBalance = parseFloat(availableBalance.replace(/[$,]/g, ""));

                    // Ensure the balance is retrieved correctly:
                    expect(refactoredAvailableBalance).to.be.a("number");
                    expect(refactoredAvailableBalance).to.be.greaterThan(0);

                    // Navigate to loan request page:
                    cy.visit("/requestloan.htm");

                    // Enter loan details - use a value higher than available balance:
                    cy.get("input#amount").type("10000");

                    const downPaymentAmount = refactoredAvailableBalance + 100;
                    cy.get("input#downPayment").type(downPaymentAmount.toString());

                    // Retrieve downPayment value:
                    cy.get("input#downPayment").invoke("val").then((downPaymentValue) => {
                        cy.log(`Down Payment Entered: ${downPaymentValue}`);

                        // Ensure downPaymentValue is correctly parsed:
                        const parsedDownPayment = parseFloat(downPaymentValue);

                        expect(parsedDownPayment).to.be.a("number");

                        // Verify the down payment is indeed greater than available balance:
                        expect(parsedDownPayment).to.be.greaterThan(refactoredAvailableBalance);
                    });

                    // Submit the loan application:
                    cy.get("input[value='Apply Now']").click();

                    cy.get("#loanRequestDenied").should("contain", "You do not have sufficient funds for the given down payment.");
                    cy.get("#loanStatus").should("have.text", "Denied");
                });
        });
    })

    it("should return 'Error! An internal error has occurred and has been logged.' after passing numeric value 0", () => {

        cy.get("input#amount").type("0");
        cy.get("input#downPayment").type("0");
        cy.get("input[value='Apply Now']").click();

        cy.get("#requestLoanError h1").should("contain", "Error!");
        cy.get("#requestLoanError p").should("contain", "An internal error has occurred and has been logged.");

    })

    it("should return 'Error! An internal error has occurred and has been logged.' after passing space character to $ fields", () => {

        cy.get("input#amount").type(" ");
        cy.get("input#downPayment").type(" ");
        cy.get("input[value='Apply Now']").click();

        cy.get("#requestLoanError h1").should("contain", "Error!");
        cy.get("#requestLoanError p").should("contain", "An internal error has occurred and has been logged.");

    })

    it("should return 'Error! An internal error has occurred and has been logged.' if 'Loan Amount $' value is missing ", () => {

        cy.get("input#downPayment").clear().type("100");
        cy.get("input[value='Apply Now']").click();

        cy.get("#requestLoanError h1").should("contain", "Error!");
        cy.get("#requestLoanError p").should("contain", "An internal error has occurred and has been logged.");

    })

    it("should return 'Error! An internal error has occurred and has been logged.' if 'Down Payment: $' value is missing ", () => {

        cy.get("input#amount").clear().type("100");
        cy.get("input[value='Apply Now']").click();

        cy.get("#requestLoanError h1").should("contain", "Error!");
        cy.get("#requestLoanError p").should("contain", "An internal error has occurred and has been logged.");
    })
});