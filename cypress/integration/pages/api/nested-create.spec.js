it('GET /using-many => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-many?hello=world',
    failOnStatusCode: false,
    body: { key: 'asd' },
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('GET /using-many => 200 body', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-many?hello=world',
    failOnStatusCode: false,
    body: { key: 'asd' },
  }).then((response) => {
    expect(response.body).to.deep.eq({
      key: 'asd',
      hello: 'world',
      method: 'GET',
    })
  })
})

it('PUT /using-many headers', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/using-many',
    failOnStatusCode: false,
    body: { key: 'asd' },
  })
    .its('headers')
    .then((headers) => {
      expect(headers).to.have.property('access-control-allow-methods')
    })
})
