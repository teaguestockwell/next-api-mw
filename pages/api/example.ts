import { HandlerFactory, createMiddleware } from '../../src'

// create one handler factory, then export it so you can create handlers for all your routes
// you may also pass a logger, devLogger, and handleError functions to the constructor
export const handlerFactory = new HandlerFactory()

// middleware can be consumed in as many routes as you want.
// you can even use one middleware inside of another
export const usingFooQS = createMiddleware(async ({req, res, end}) => {
  const { foo } = req.query

  if (!foo || typeof foo !== 'string') {
    res.status(400).json({ msg: 'invalid foo' })
    // the res will be sent and the handler and or the next middleware will not be evaluated
    end()
  }

  return foo as string
})

// default export a handler in any file under page/api
export default handlerFactory.getHandler(async ({req, res, end}) => {
  // you may consume middleware inside of get handler
  const foo = await usingFooQS({req, res})
  res.status(200).json({ foo })
  end()
})
