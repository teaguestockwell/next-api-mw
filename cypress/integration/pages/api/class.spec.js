it('GET /class => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/class?foo=bar',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.deep.equal({foo: 'bar'});
  });
});

it('GET /create?hello=world => 400', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/class?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(400);
  });
});
