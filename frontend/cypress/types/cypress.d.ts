/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Sends a login request to the API using the default username and password
     *
     * If the `password` parameter is provided, it is used as an override for the password
     */
    login(password?: string): void;
  }
}
