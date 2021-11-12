const ep = Cypress.env('CYPRESS_BASE_URL') + '/test'

it('returns 500', () => {
  cy.request({
    method: 'GET',
    url: ep,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(500)
  })
})