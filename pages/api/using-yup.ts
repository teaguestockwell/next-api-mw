import { usingYup } from '../../middleware'
import { handlerFactory } from './example'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  const query = await usingYup({req, res})
  res.status(200).json(query)
  end()
})
