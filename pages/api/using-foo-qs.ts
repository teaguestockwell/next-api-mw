import { handlerFactory, usingFooQS } from '../../middleware'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  const foo = await usingFooQS({req, res})
  res.status(200).json({ foo })
  end()
})
