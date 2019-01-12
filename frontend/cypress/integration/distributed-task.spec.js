describe('distributed task', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should add a distributed task definition', () => {
    cy.visit('distributed-task-definitions');

    cy.get('[title=Create]').click();

    cy.url().should('contain', 'create');

    cy.get('input[name=Name]').type('Factorial task');
    cy.get('textarea[name=Description]').type(
      'An example{enter}Multiline description',
    );

    cy.uploadFile('FactorialTask.dll', 'input[name=MainDll]');
    cy.uploadFile(
      'DistributedComputingLibrary.dll',
      'input[name=AdditionalDlls]',
    );

    cy.contains('Submit').click();

    cy.contains('Distributed Task Definition added');
  });

  it('should display the details of an added task definition', () => {
    cy.visit('distributed-task-definitions');

    cy.contains('FactorialTask')
      .parents('div.rt-tr')
      .contains('See details')
      .click();
  });

  it('should add a distributed task', () => {
    cy.visit('distributed-task-definitions');

    cy.contains('FactorialTask')
      .parents('div.rt-tr')
      .contains('See details')
      .click();

    cy.contains('Distributed Task Definition details');

    cy.get('[title=Create]').click();

    cy.url().should('contain', 'create');

    cy.get('input[name=Name]').type('Sample task');
    cy.get('textarea[name=Description]').type(
      'An example{enter}Multiline description',
    );

    cy.uploadFile('task-input-data.txt', 'input[name=InputData]');

    cy.contains('Submit').click();

    cy.contains('Distributed Task added');
  });
});
