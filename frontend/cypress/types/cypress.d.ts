/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Sends a login request to the API using the default username and password
     *
     * @param password If provided, overrides the used password
     */
    login(password?: string): void;

    /**
     * Selects a file for upload
     *
     * @see https://github.com/cypress-io/cypress/issues/170#issuecomment-404931741
     *
     * @param fileName Name of the file in the `fixtures` directory
     * @param selector Selector for a input[type=file]
     * @param mimeType Mime type of the file. `application/octet-stream` by default
     */
    uploadFile(
      fileName: string,
      selector: string,
      mimeType?: string,
    ): Chainable<Subject>;
  }
}
