/// <reference types="cypress"/>

describe("Admin Page", () => {

    beforeEach(() => {
        cy.visit("/admin.htm");
    })

    it("should return 'Settings saved successfully.' after 'SUBMIT' button click", () => {

        cy.get("input[value='Submit']").click();

        cy.get("#rightPanel > p")
            .contains("Settings saved successfully.")
            .should("exist")
            .and("be.visible");
    });

    // Database/ JMS Service:
    it("should return a message 'Database Initialized' and change URL link to: ${baseUrl}/db.htm after'INITIALIZE' button click", () => {

        cy.get("button[value='INIT']").click();
        cy.url().should("contain", "db.htm");

    })

    it("should return a message 'Database Initialized' and change URL link to: ${baseUrl}/db.htm after'INITIALIZE' button click", () => {

        cy.get("button[value='CLEAN']").click();
        cy.url().should("contain", "db.htm");

    })

    it("should indicate JMS Service Status as set to default: 'Stopped'", () => {
        cy.get("tr> td")
            .contains("Stopped")
            .should("exist")
            .and("be.visible");
    })

    it("should switch status to: 'Stopped', and URL will contain 'shutdown.success' after a 'SHUTDOWN' button click", () => {

        cy.get("input[value='Startup']").click();

        cy.get("td")
            .contains("Running")
            .should("exist")
            .and("be.visible");

        cy.url()
            .should("contain", "startup.success")
    })

    it("should switch status to: 'Running', and URL will contain 'shutdown.success' after a 'STARTUP' button click", () => {

        cy.get("input[value='Shutdown']").click();

        cy.get("td")
            .contains("Stopped")
            .should("exist")
            .and("be.visible");

        cy.url()
            .should("contain", "shutdown.success")
    })

    // Data Access Mode:

    it("should check input type radio to be checked/set by default as 'JDBC'", () => {
        cy.get("input#accessMode4[value='jdbc']").should("have.attr", "checked");
    })


    it("should check if all radio buttons are selectable", () => {

        const radioButtons = [
            { selector: "input#accessMode1", value: 'soap' },
            { selector: "input#accessMode2", value: 'restxml' },
            { selector: "input#accessMode3", value: 'restjson' },
            { selector: "input#accessMode4", value: 'jdbc' }
        ];

        radioButtons.forEach(({ selector, value }) => {
            cy.get(`${selector}[value='${value}']`).check().should('be.checked');
        });
    })

    // Web Service:

    it("should link to ${baseUrl}/services/ParaBank?wsdl after 'WSDL' click", () => {

        cy.get("td").contains("WSDL").click();
        const expectedUrlPart = `${Cypress.config("baseUrl")}/services/ParaBank`;

        cy.url().then(url => {
            expect(url).to.include(expectedUrlPart);
            expect(url).to.include('jsessionid=');
            expect(url).to.include('wsdl');
        });
    })

    it("should link to ${baseUrl}/services/bank?_wadl&_type=xml after 'WADL' click", () => {

        cy.get("td").contains("WADL").click();
        const expectedUrlPart = `${Cypress.config("baseUrl")}/services/bank`;

        cy.url().then(url => {
            expect(url).to.include(expectedUrlPart);
            expect(url).to.include('jsessionid=');
            expect(url).to.include('?_wadl&_type=xml');
        });
    })

    it("should link to ${baseUrl}/api-docs/index.html after 'OpenAPI' click", () => {

        cy.get("td").contains("OpenAPI").click();
        const expectedUrlPart = `${Cypress.config("baseUrl")}/api-docs/index.html`;

        cy.url().then(url => {
            expect(url).to.include(expectedUrlPart);
            expect(url).to.include('jsessionid=');
        });
    })

    it("should link to ${baseUrl}/services/LoanProcessor?wsdl after 'LoadProcessor Service WSDL' click", () => {

        cy.get("tbody > tr > td a[href*='LoanProcessor']").contains("WSDL").click();

        const expectedUrlPart = `${Cypress.config("baseUrl")}/services/LoanProcessor`;

        cy.url().then(url => {
            expect(url).to.include(expectedUrlPart);
            expect(url).to.include('jsessionid=');
            expect(url).to.include('?wsdl');
        });
    })

    // Application Settings:

    it("should show error text messages if 'Application Settings' fields are not filled in", () => {

        cy.get("#initialBalance").clear();
        cy.get("#minimumBalance").clear();
        cy.get("#loanProcessorThreshold").clear();

        cy.get("input[value='Submit']").click();

        const applicationSettingErrors = [
            { selector: "initialBalance", error: "Initial balance is required." },
            { selector: "minimumBalance", error: "Minimum balance is required." },
            { selector: "loanProcessorThreshold", error: "Threshold is required." }
        ];

        applicationSettingErrors.forEach((item) => {
            cy.get(`span#${item.selector}\\.errors`)
                .should("exist")
                .and("be.visible")
                .and("contain", item.error)
        });
    })

    it("should validate 'Init. Balance: $' and reject non-numeric values", () => {
        const invalidInputs = ["abc", "test123", "12.34.56", "🧩"];

        invalidInputs.forEach((input) => {

            cy.get("#initialBalance").clear().type(input);
            cy.get("#minimumBalance").clear().type(input);
            cy.get("#loanProcessorThreshold").clear().type(input);

            cy.get("input[value='Submit']").click();

            const expectedErrors = [
                { selector: "initialBalance", error: "Please enter a valid amount." },
                { selector: "minimumBalance", error: "Please enter a valid amount." },
                { selector: "loanProcessorThreshold", error: "Please enter a valid number." }
            ];

            expectedErrors.forEach(({ selector, error }) => {
                cy.get(`span#${selector}\\.errors`)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", error);
            });
        });
    });

    it("should be set to 'Web Service' by default of 'Loan Provider'", () => {

        cy.get("#loanProvider option[value='ws']")
            .should("be.visible")
            .and("have.attr", "selected");

    })

    it("should have a select element of'Loan Provider' and contain option values of: 'JMS', 'Web Service', 'Local'", () => {

        cy.get("#loanProvider").children().should("exist");

        const optionValues = [
            { option: "jms", text: "JMS" },
            { option: "ws", text: "Web Service" },
            { option: "local", text: "Local" }
        ];

        optionValues.forEach((item) => {

            cy.get(`#loanProvider option[value="${item.option}"]`)
                .should("exist")
                .and("be.visible")
                .contains(`${item.text}`);
        })

    })

    it("should be set to 'Available Funds' by default of 'Loan Processor'", () => {

        cy.get("#loanProcessor option[value='funds']")
            .should("be.visible")
            .and("have.attr", "selected");

    })

    it("should have a select element of'Loan Provider' and contain option values of: 'Available Funds', 'Down Payment', 'Combined'", () => {

        cy.get("#loanProcessor").children().should("exist");

        const optionValues = [
            { option: "funds", text: "Available Funds" },
            { option: "down", text: "Down Payment" },
            { option: "combined", text: "Combined" }
        ];

        optionValues.forEach((item) => {

            cy.get(`#loanProcessor option[value="${item.option}"]`)
                .should("exist")
                .and("be.visible")
                .contains(`${item.text}`);
        })

    })

    it("should not exceed 10 digit value of: 2 147 483 647 % threshold input", () => {

        cy.get("input#loanProcessorThreshold").clear().type("2147483647");
        cy.get("input[value='Submit']").click();

        cy.get("#rightPanel p > b")
            .should("exist")
            .and("be.visible")
            .and("have.text", "Settings saved successfully.")

    })

    it("should return 'Please enter a valid number.' after increasing 2147483647 % threshold value", () => {

        cy.get("input#loanProcessorThreshold").clear().type("2147483647.1");
        cy.get("input[value='Submit']").click();

        cy.get("span#loanProcessorThreshold\\.errors")
            .should("exist")
            .and("be.visible")
            .and("have.text", "Please enter a valid number.")
    })

});
