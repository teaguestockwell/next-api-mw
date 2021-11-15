import { createRouteFactory, createMiddleware } from '../../src/index'
import * as yup from 'yup'

const schema = yup.object().shape({
  foo: yup.string().required(),
  bar: yup.string().required(),
})

const usingFooBarQuery = createMiddleware(async ({req, res, end}) => {
  try {
    await schema.validate(req.query)
  } catch (e) {
    res.status(400).json({ msg: String(e) })
    end()
  }
  return req.query as { foo: string; bar: string }
})

const rf = createRouteFactory({})

export default rf.createHandler(async ({req, res, end}) => {
  const query = await usingFooBarQuery(req, res)
  res.status(200).json(query)
  end()
})
