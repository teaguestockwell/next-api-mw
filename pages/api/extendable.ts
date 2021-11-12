import {Middleware} from '../../src/index'

const mw = new Middleware({
  name: 'console logger',
  consoleLogLevel: 'all',
  logger: (req,res,e) => {
    console.log('a custom logger: ' + res.statusCode)
  },
  onServerError: (res) => {
    res.status(500).json({
      msg: `Something went wrong. Its not you, it's us.`
    })
  },
})

const usingMethods = mw.create(async (req,res,end, verbs:string[]) => {
  const method = String(req.method).toUpperCase()
  const allowedMethods = verbs.map((v) => v.toUpperCase())

  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '))

  if (!allowedMethods.includes(method)) {
    res.status(405).json({msg: `Method: ${method} not allowed`})
    end()
  }

  return method
}) 

export default mw.run(async (req,res,end) => {
  const method = await usingMethods(req,res,['get', 'POST'])
  res.json({msg: `Method: ${method}`})
  end()
})