import {Middleware} from '../../src/index'

const middleware = new Middleware()

const usingMethod = middleware.produce(async (req,res,abort, verbs:string[]) => {
  const method = String(req.method).toUpperCase()
  const allowedMethods = verbs.map((v) => v.toUpperCase())

  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '))

  if (!allowedMethods.includes(method)) {
    abort({status: 405, body: `method ${method} not allowed`})
  }

  return Date.now()
})

export default middleware.handle(async (req,res) => {
  const time = await usingMethod(req,res,['put'])
  res.status(200).json(time)
})