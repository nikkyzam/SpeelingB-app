describe('Learning Flow', () => {
  it('should complete daily goal', () => {
    cy.login('test@example.com', 'TestPassword123!');
    cy.completeDailyGoal(30);
    cy.get('[data-testid="practice-mode-button"]').should('be.enabled');
  });
});
