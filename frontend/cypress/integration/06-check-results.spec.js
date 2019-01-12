it('should return correct results', () => {
  cy.login();

  cy.visit('distributed-tasks');

  cy.contains('See details').click();

  cy.contains('a', 'Download results')
    .should('have.attr', 'href')
    .then((href) => {
      cy.request(href)
        .its('body')
        .should('be.equal', '153');
    });
});
