import {Middleware} from '../../src/index'

const middleware = new Middleware({consoleLogLevel: 'all'})

export default middleware.run(async (req,res) => {
  throw new Error('test')
})