describe('login', () => {
  it('logs in', () => {
    cy.visit('authentication/login');

    cy.get('[name=username]').type('admin');
    cy.get('[name=password]').type('D1stributed$');

    cy.contains('Submit').click();

    cy.url().should('not.include', '/authentication');
  });

  it('fails to log in using invalid credentials', () => {
    cy.visit('authentication/login');

    cy.get('[name=username]').type('admin');
    cy.get('[name=password]').type('not a valid password');

    cy.contains('Submit').click();

    cy.contains('Invalid credentials');
  });
});
