it('GET /create => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('GET /create?hello=world => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/create?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('POST /create => 200', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

it('PUT /create => 405', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('HEAD /create => 405', () => {
  cy.request({
    method: 'HEAD',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('DELETE /create => 405', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('PATCH /create => 405', () => {
  cy.request({
    method: 'PATCH',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.equal(405)
  })
})

it('PUT /create body', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.body).to.deep.equal({ msg: `Method: PUT not allowed` })
  })
})

it('PUT /create headers', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/api/create',
    failOnStatusCode: false,
  })
    .its('headers')
    .then((headers) => {
      expect(headers).to.have.property('access-control-allow-methods')
    })
})
