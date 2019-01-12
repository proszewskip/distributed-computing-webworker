describe('worker', () => {
  it('should register', () => {
    cy.visit('worker');

    cy.contains('The worker is registered');
  });

  it('should start the worker and compute some tasks', () => {
    cy.visit('worker');

    cy.get('[title="Increment used threads"]')
      .click()
      .click()
      .click()
      .click();

    cy.contains('Start the worker').click();

    cy.wait(2000);

    cy.contains('p', 'Active threads: 0', { timeout: 10000 });

    cy.contains('Stop the worker').click();
  });
});
