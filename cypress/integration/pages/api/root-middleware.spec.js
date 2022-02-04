it('PUT /using-root-middleware intercepted by root middleware => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-root-middleware?token=123',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal({msg: 'token-accepted'})
  })
})

it('PUT /root => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-root-middleware',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal({msg: 'root-child-handler'})
  })
})