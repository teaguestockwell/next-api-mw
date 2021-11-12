import { middleware } from '../../src/index';

export default middleware.run(async (req, res, end) => {
  res.status(200).json({ msg: 'ok' });
  end();
});
