import { nextApiMw } from '../../src/index';

export default nextApiMw.run(async (req, res, end) => {
  res.status(200).json({ msg: 'ok' });
  end();
});
