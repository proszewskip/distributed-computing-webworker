describe('logout', () => {
  it('should log out', () => {
    cy.login();

    cy.visit('authentication/logout');

    cy.url().should('include', '/authentication/login');
    cy.contains('logged out');
  });
});
