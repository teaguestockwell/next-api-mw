import { nextApiMw } from '../../src/index'
import * as yup from 'yup'

const schema = yup.object().shape({
  foo: yup.string().required(),
  bar: yup.string().required(),
})

const usingFooBarQuery = nextApiMw.create(async (req, res, end) => {
  try {
    await schema.validate(req.query)
  } catch (e) {
    res.status(400).json({ msg: String(e) })
    end()
  }
  return req.query as { foo: string; bar: string }
})

export default nextApiMw.run(async (req, res, end) => {
  const query = await usingFooBarQuery(req, res)
  res.status(200).json(query)
  end()
})
