it('PUT /example intercepted by root middleware => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/example?foo=bar&token=123',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal({ msg: 'token-accepted' })
  })
})