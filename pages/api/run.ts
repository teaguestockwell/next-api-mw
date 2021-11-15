import { createRouteFactory } from '../../src/index'

const rf = createRouteFactory({})

export default rf.createHandler(async ({req, res, end}) => {
  res.status(200).json({ msg: 'ok' })
  end()
})
