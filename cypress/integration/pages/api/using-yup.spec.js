it('GET /using-yup => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-yup?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(400)
  })
})

it('GET /using-yup => 400', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-yup?foo=apple&bar=pear',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal({ foo: 'apple', bar: 'pear' })
  })
})
