import { createRouteFactory, createMiddleware } from '../../src/index'

const routeFactory = createRouteFactory({})

const usingFooQS = createMiddleware(async ({req, res, end}) => {
  const { foo } = req.query

  if (!foo || typeof foo !== 'string') {
    res.status(400).json({ msg: 'invalid foo' })
    end()
  }

  return foo as string
})

export default routeFactory.createHandler(async ({req, res, end}) => {
  const foo = await usingFooQS(req, res)
  res.status(200).json({ foo })
  end()
})
