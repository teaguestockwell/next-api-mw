it('GET /run => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/run',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('GET /run => body', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/run',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.body).to.deep.equal({ msg: 'ok' })
  })
})
