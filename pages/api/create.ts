import { nextApiMw } from '../../src/index';

const usingMethods = nextApiMw.create(
  async (req, res, end, verbs: string[]) => {
    const method = String(req.method).toUpperCase();
    const allowedMethods = verbs.map((v) => v.toUpperCase());

    res.setHeader('access-control-allow-methods', allowedMethods.join(', '));

    if (!allowedMethods.includes(method)) {
      res.status(405).json({ msg: `Method: ${method} not allowed` });
      end();
    }

    return method;
  }
);

export default nextApiMw.run(async (req, res, end) => {
  const method = await usingMethods(req, res, ['get', 'POST']);
  res.json({ msg: `Method: ${method}` });
  end();
});
