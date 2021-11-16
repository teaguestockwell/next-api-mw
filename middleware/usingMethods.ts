import { createMiddleware } from "../src"

export const usingMethods = createMiddleware(async ({req, res, end},verbs: string[]) => {
  const method = String(req.method).toUpperCase()
  const allowedMethods = verbs.map((v) => v.toUpperCase())

  res.setHeader('access-control-allow-methods', allowedMethods.join(', '))

  // if the method is not allowed,
  // send a 405 and end the request
  if (!allowedMethods.includes(method)) {
    res.status(405).json({ msg: `Method: ${method} not allowed` })
    end()
  }

  return method
}
)