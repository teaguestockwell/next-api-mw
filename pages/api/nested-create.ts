import { middleware } from '../../src/index';

const usingGet = middleware.create(async (req, res, end) => {
  const method = String(req.method).toUpperCase();

  res.setHeader('access-control-allow-methods', 'GET');

  if (method !== 'GET') {
    res.status(405).json({ msg: `method: ${method} allowed` });
    end();
  }

  return method;
});

const usingHelloParam = middleware.create(async (req, res, end) => {
  const { hello } = req.query;

  res.setHeader('hello', hello);

  if (!hello) {
    res.status(400).send({ msg: 'hello query param req' });
    end();
  }

  return hello;
});

const usingBodyKey = middleware.create((req, res, end) => {
  const { key } = req.body;

  if (!key) {
    res.status(400).send({ msg: 'key body param req' });
    end();
  }

  return key;
});


export default middleware.run(async (req, res, end) => {
  const method = await usingGet(req, res);
  const hello = await usingHelloParam(req, res);
  const key = await usingBodyKey(req, res);

  res.status(200).json({ hello, key, method });
  end();
});
