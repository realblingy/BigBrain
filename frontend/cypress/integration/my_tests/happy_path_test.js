context('Happy path', () => {
  beforeEach(() => {
      cy.visit('localhost:3000');
  })

  it('Happy path test', async () => {
    const name = 'Hayden Smith';
    const email = 'HaydenSmithy2gmail.com';
    const password = 'passw0rd';
    const quizName = 'Hayden Smith Chips'
    const question = 'Best Lecturer?';
    const answers = ['Yes', 'No', 'I dunno'];

    cy.get('button[name=register]')
      .click();
    
    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('input[name=name')
      .focus()
      .type(name);

    cy.get('button[name=submit]')
      .focus()
      .click();

    cy.get('input[name=newQuizField]')
      .focus()
      .type(quizName)

    cy.get('svg[name=addQuizIcon]')
      .click();

    // cy.get('button[name=exit]')
    //   .click();

    cy.get('button[aria-label="Hayden Smith Chips Quiz Button"]')
      .click();

    cy.get('button[name=addQuestionBtn]')
      .click();

    cy.get('input[name=questionField]')
      .focus()
      .type(question);

    cy.get('input[name=answerField]')
      .focus()
      .type(answers[0]);
    
    cy.get('button[name=addQuestionIcon]')
      .click();

    cy.get('input[name=answerField]')
    .focus()
    .type(answers[1]);

    cy.get('button[name=addQuestionIcon]')
    .click();

    cy.get('button[name=submitBtn]')
      .click();

    cy.get('h6[name=homeButton]')
      .click();

    cy.get('svg[class="MuiSvgIcon-root makeStyles-icon-28"]')
      .click();

    cy.get('button[name=startSession]')
      .click();

    cy.wait(500);

    cy.get('svg[name=pauseIcon]')
      .click();
    
    cy.get('button[name=yes]')
      .click();
    // cy.get('button[name=exit]')
    //   .click();
    // cy.get('button[aria-label="Hayden Smith Chips Quiz Button"]')
    //   .click();
    cy.get('button[name=accountIcon]')
      .click();

    cy.get('li[name=logout]')
      .click();

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=passwordField')
      .focus()
      .type(password);

    cy.get('button[id="submit-login"')
      .click();
  });

})