// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (password = 'D1stributed$') => {
  cy.log('Sending a login request straight to the API.');
  cy.log('If it fails, make sure the backend is running');
  cy.log('If it is, restart the backend to restart the database');

  cy.request('POST', 'api/users/login', {
    username: 'admin',
    password,
  });
});

/**
 * @see https://github.com/cypress-io/cypress/issues/170#issuecomment-404931741
 */
Cypress.Commands.add(
  'uploadFile',
  (fileName, selector, mimeType = 'application/octet-stream') => {
    return cy.get(selector).then((subject) => {
      return cy
        .fixture(fileName, 'base64')
        .then(Cypress.Blob.base64StringToBlob)
        .then((blob) => {
          const el = subject[0];
          const testFile = new File([blob], fileName, {
            type: mimeType,
          });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          return subject;
        });
    });
  },
);
