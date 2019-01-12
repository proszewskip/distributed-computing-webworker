const changePassword = (oldPassword, newPassword) => () => {
  cy.login(oldPassword);

  cy.visit('authentication/change-password');

  cy.get('[name=old-password]').type(oldPassword);
  cy.get('[name=new-password]').type(newPassword);
  cy.get('[name=confirm-new-password]').type(newPassword);

  cy.contains('Submit').click();

  cy.contains('Password changed successfully');
};

describe('change password', () => {
  const defaultPassword = 'D1stributed$';
  const newPassword = 'N3wP@ssword';

  it('changes the password', changePassword(defaultPassword, newPassword));

  it('logs in with the new password', () => {
    cy.visit('authentication/login');

    cy.get('[name=username]').type('admin');

    const passwordField = cy.get('[name=password]');
    passwordField.type(defaultPassword);

    cy.contains('Submit').click();

    cy.contains('Invalid credentials');

    cy.get('[name=password]')
      .clear()
      .type(newPassword);
    cy.contains('Submit').click();

    cy.url().should('not.include', '/authentication');
  });

  it('restores the password', changePassword(newPassword, defaultPassword));
});
