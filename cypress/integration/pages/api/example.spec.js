it('GET /example => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/example?foo=bar',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal({ foo: 'bar' })
  })
})

it('GET /example => 400', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/example?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(400)
  })
})