import { usingMethods } from '../../middleware'
import { handlerFactory } from './example'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  // method will always be 'GET' | 'POST'
  // when the method is not allowed, the request will end here
  const method = await usingMethods({req, res, param: ['GET', 'POST']})
  res.json({ msg: `Method: ${method}` })
  end()
})
