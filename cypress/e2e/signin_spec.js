describe('Sign In Page', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
  });

  it('should display the sign in form', () => {
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Sign in');
  });

  it('should allow user to sign in with valid credentials', () => {
    cy.get('input[name="email"]').type('shetty1@123');
    cy.get('input[name="password"]').type('shetty');
    cy.get('button[type="submit"]').click();

    // Wait for toast success message text
    cy.contains('Login Successful!', { timeout: 10000 }).should('exist');

    // Wait for redirect to home page
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show error on invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Wait for toast error message text
    cy.contains('Login Failed. Please check your credentials.', { timeout: 10000 }).should('exist');
  });
});
