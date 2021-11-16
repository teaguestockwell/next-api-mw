import {usingYup, handlerFactory } from '../../middleware'

export default handlerFactory.getHandler(async ({req, res, end}) => {
  const query = await usingYup({req, res})
  res.status(200).json(query)
  end()
})
