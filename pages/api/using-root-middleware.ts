import { handlerFactory } from './example'

// this handler will never fire because it will be handled by the root middleware
export default handlerFactory.getHandler(async ({ req, res, end }) => {
  res.status(200).json({ msg: 'root-child-handler' })
  end()
})