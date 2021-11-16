import { createMiddleware } from "../src"

export const usingFooQS = createMiddleware(async ({req, res, end}) => {
  const { foo } = req.query

  if (!foo || typeof foo !== 'string') {
    res.status(400).json({ msg: 'invalid foo' })
    end()
  }

  return foo as string
})