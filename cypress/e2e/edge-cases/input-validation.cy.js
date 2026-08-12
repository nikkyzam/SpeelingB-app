describe('Input Validation Edge Cases', () => {
  it('should handle SQL injection attempts', () => {
    cy.visit('/register');
    const sqlInjection = "Joy'; DROP TABLE users; --";
    cy.get('[data-testid="name-input"]').type(sqlInjection, { sanitize: true });
    cy.get('[data-testid="name-input"]').invoke('val').should('not.include', "';");
  });
});
