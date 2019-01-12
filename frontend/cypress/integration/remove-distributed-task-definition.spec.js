it('should remove distributed task definition', () => {
  cy.login();

  cy.visit('distributed-task-definitions');

  cy.contains('Delete').click();

  cy.contains('The entity has been deleted');
});
