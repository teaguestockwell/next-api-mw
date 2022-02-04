import { usingMany } from '../../middleware'
import { handlerFactory } from './example'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  const { hello, key, method } = await usingMany({req, res})
  res.status(200).json({ hello, key, method })
  end()
})
