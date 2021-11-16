it('GET /using-methods => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('GET /using-methods?hello=world => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/using-methods?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('POST /using-methods => 200', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('PUT /using-methods => 405', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('HEAD /using-methods => 405', () => {
  cy.request({
    method: 'HEAD',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('DELETE /using-methods => 405', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('PATCH /using-methods => 405', () => {
  cy.request({
    method: 'PATCH',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('PUT /using-methods body', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.body).to.deep.equal({ msg: `Method: PUT not allowed` })
  })
})

it('PUT /using-methods headers', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/using-methods',
    failOnStatusCode: false,
  })
    .its('headers')
    .then((headers) => {
      expect(headers).to.have.property('access-control-allow-methods')
    })
})
