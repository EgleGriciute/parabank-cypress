/// <reference types="cypress"/>

describe("Index Page", () => {

    beforeEach(() => {
        cy.visit("/");
    })

    it("should navigate to ${baseUrl}/services/ParaBank?wsdl after clicking on 'ATM Services' list items", () => {

        const services = ["Withdraw Funds", "Transfer Funds", "Check Balances", "Make Deposits"];
        const expectedUrl = `${Cypress.config("baseUrl")}/services/ParaBank?wsdl`;

        services.forEach((service) => {
            cy.get("ul.services li").contains(service).click();
            cy.url().should("eq", expectedUrl);
            cy.visit("/");
        });

    });

    it("should navigate to ${baseUrl}/services/bank?_wadl&_type=xml after clicking on 'Online Services' list items", () => {

        const services = ["Bill Pay", "Account History", "Transfer Funds"];
        const expectedUrl = `${Cypress.config("baseUrl")}/services/bank?_wadl&_type=xml`;

        services.forEach((service) => {
            cy.get("ul.servicestwo li").contains(service).click();
            cy.url().should("eq", expectedUrl);
            cy.visit("/");

        })

    })

    it("should navigate to ${baseUrl}/services.htm after 'READ MORE' click", () => {

        cy.get("p.more a[href='services.htm']").click();
        cy.url().should("contain", "services.htm")

    })

    it("should show the correct caption date", () => {

        cy.getTodaysDateSlashFormat().as("todayDate");

        cy.get("@todayDate").then((todayDate) => {
            cy.get("ul.events li.captionthree").should("have.text", todayDate);
        });
    })

    it("should navigate to ${baseUrl}/news.htm#${number} after clicking on 'Latest News' list items", () => {

        const newsListItems = [
            { title: "ParaBank Is Now Re-Opened", id: 6 },
            { title: "New! Online Bill Pay", id: 5 },
            { title: "New! Online Account Transfers", id: 4 }
        ];

        newsListItems.forEach(({ title, id }) => {
            const expectedUrl = `${Cypress.config("baseUrl")}/news.htm#${id}`;
            cy.get("ul.events").contains(title).click();
            cy.url().should("eq", expectedUrl);
            cy.visit("/");
        });

    })

    it("should launch ${baseUrl}/news.htm after 'RED MORE' click", () => {
        cy.get("p.more a[href='news.htm']").click();
        cy.url().should("contain", "news.htm");
    })
});

