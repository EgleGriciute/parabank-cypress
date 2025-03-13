const { faker } = require("@faker-js/faker");

Cypress.Commands.add("loadHomePageSuccessfully", () => {

    // should return a success status code (200):
    cy.intercept("GET", "/parabank/index.htm").as("pageLoad");

    // Visit the page:
    cy.visit("/index.htm");

    // Wait for the page load and check the status code:
    cy.wait("@pageLoad").then((interception) => {
        // Get the status code from the interception:
        const statusCode = interception.response.statusCode;

        // Check that the status code is 200 (OK):
        expect(statusCode).to.equal(200);
        // });
    });

    // should load the page within 3000ms:
    cy.intercept("GET", "/parabank/index.htm").as("pageLoad");

    // Record start time and visit page:
    const start = Date.now();
    cy.visit("/index.htm");

    // Wait for the page load interception:
    cy.wait("@pageLoad").then(() => {
        // Record end time and calculate the load time:
        const end = Date.now();
        const loadTime = end - start;

        // Check that load time is less than 3000ms:
        expect(loadTime).to.be.lessThan(3000);
        // });
    });

    // should load the page without JavaScript errors:

    cy.visit("/index.htm");

    cy.window().then((win) => {
        const consoleError = win.console.error;
        cy.spy(win.console, "error").as("consoleError");
    });

    // After the page loads, check that no errors were logged:
    cy.get("@consoleError").should("not.have.been.called");
    // });
})

Cypress.Commands.add("registerEndUser", () => {

    cy.clearCookies();
    cy.clearLocalStorage();
    sessionStorage.clear();

    // Generate user data
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const address = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const zipCode = faker.location.zipCode();
    const phoneNumber = faker.phone.number({ style: 'international' });
    const ssn = faker.number.int(1000000000);
    const username = faker.internet.username();
    const userPassword = faker.internet.password();

    // Store user data in an object
    const userData = {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
        ssn,
        username,
        password: userPassword,
    };

    // Create a unique session ID using the username
    const sessionId = `user-session-${Cypress._.random(1000, 9999)}`;

    // Save user data and session ID to a fixture file
    cy.writeFile('cypress/fixtures/sessionInfo.json', { sessionId, userData });

    // Use Cypress session API to create a session and register the user
    cy.session(sessionId, () => {
        // Visit the registration page
        cy.visit("/register.htm");

        // Fill out the registration form
        cy.get("#customer\\.firstName").type(firstName);
        cy.get("#customer\\.lastName").type(lastName);
        cy.get("#customer\\.address\\.street").type(address);
        cy.get("#customer\\.address\\.city").type(city);
        cy.get("#customer\\.address\\.state").type(state);
        cy.get("#customer\\.address\\.zipCode").type(zipCode);
        cy.get("#customer\\.phoneNumber").type(phoneNumber);
        cy.get("#customer\\.ssn").type(ssn);
        cy.get("#customer\\.username").type(username);
        cy.get("#customer\\.password").type(userPassword);
        cy.get("#repeatedPassword").type(userPassword);

        // Submit form
        cy.get("input[value='Register']").click();

        // Assert that we are redirected to the expected page after registration
        cy.location("pathname").should("eq", "/parabank/register.htm");

        // Assert for welcome messages or confirmation of registration
        cy.get("#leftPanel > .smallText", { timeout: 10000 })
            .should("contain", `Welcome ${firstName} ${lastName}`);

        cy.get("#rightPanel > .title")
            .should("contain", username);
    });
});

Cypress.Commands.add("logOut", () => {
    cy.visit("/overview.htm");
    cy.get("a[href='logout.htm']").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/index.htm`);
});

Cypress.Commands.add("loginWithRegisteredUser", () => {
    return cy.fixture('sessionInfo.json').then(({ userData }) => {
        // Don't try to create or restore a session here
        // Just perform the login directly
        cy.visit("/");
        cy.get("input[name='username']").type(userData.username);
        cy.get("input[name='password']").type(userData.password);
        cy.get("input[value='Log In']").click();


        // Return the userData for use in tests
        return cy.wrap(userData);
    });
});

Cypress.Commands.add("openNewAccount", (accountType) => {

    cy.visit("/openaccount.htm");

    // Load credentials from fixture
    cy.fixture('sessionInfo').then(() => {

        // Open account form validation
        cy.get("#openAccountForm h1.title").should("have.text", "Open New Account");

        // Select account type
        cy.get("#type").select(accountType);

        // Select the first available account
        cy.get("#fromAccountId option").first().invoke('text').then((text) => {
            cy.get("#fromAccountId").select(text);
        });

        // Click "Open New Account"
        cy.get("input[value='Open New Account']").click();
        cy.get("a#newAccountId").click();

    });
});

Cypress.Commands.add("transferToAccount", () => {

    cy.visit("/transfer.htm");

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

    cy.visit("/overview.htm");
});

Cypress.Commands.add("getTodaysDateSlashFormat", () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
});

Cypress.Commands.add("getTodaysDateDashFormat", () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}-${day}-${year}`;
});

Cypress.Commands.add("getTodaysDateMonth", () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${month}`;
});
