import { createMiddleware } from '../src'
import * as yup from 'yup'

const schema = yup.object().shape({
  foo: yup.string().required(),
  bar: yup.string().required(),
})

export const usingYup = createMiddleware(async ({req, res, end}) => {
  try {
    await schema.validate(req.query)
  } catch (e) {
    res.status(400).json({ msg: String(e) })
    end()
  }
  return req.query as { foo: string; bar: string }
})