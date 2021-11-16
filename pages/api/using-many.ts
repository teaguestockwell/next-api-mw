import { usingMany, handlerFactory} from '../../middleware'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  const { hello, key, method } = await usingMany({req, res})
  res.status(200).json({ hello, key, method })
  end()
})
