it('GET /class => 200', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/yup?hello=world',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(400);
  });
});

it('GET /create?hello=world => 400', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/api/yup?foo=apple&bar=pear',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.deep.equal({foo: 'apple', bar: 'pear'});
  });
});
