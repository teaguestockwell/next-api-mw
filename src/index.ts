import {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'

type Logger = (req: NextApiRequest, res: NextApiResponse, e?: Error) => Promise<void> | void

type ConsoleLogLevel = 'all' | 'unhandled' | 'none'

type Handler = (req: NextApiRequest, res:NextApiResponse, end: () => void) => Promise<void>

export class ApiClose extends Error {
  readonly name: string

  constructor() {
    super('ApiError')
    this.name = 'ApiError'
  }
}

const end = () => {throw new ApiClose()}

export class Middleware {
  private logger: Logger
  private onServerError: (res: NextApiResponse) => void
  private consoleLogLevel: ConsoleLogLevel
  private name: string

  constructor(params?: {logger?: Logger; onServerError?: (res: NextApiResponse) => void; consoleLogLevel?: ConsoleLogLevel, name?: string}) {
    if(!params){
      this.logger = async () => {}
      this.onServerError = (res) => res.status(500).json({error: 'internal server error'})
      this.consoleLogLevel = 'all'
      this.name = ''
    } else {
      this.logger = params.logger ? params.logger : async () => {}
      this.onServerError = params.onServerError ? params.onServerError : (res) => res.status(500).json({error: 'internal server error'})
      this.consoleLogLevel = params.consoleLogLevel ? params.consoleLogLevel : 'unhandled'
      this.name = params.name ? params.name : ''
    }
  }

  private handleLogs(req: NextApiRequest, res: NextApiResponse, logger:any, consoleLogLevel:string, name:string, e: Error,){
    let logConsole;

    if(e.name === 'ApiError'){
      logConsole = () => console.log(`${req.method} ${req.url} => ${res.statusCode}`)
      logger(req,res)
    } else {
      logConsole = () => console.error(`${req.method} ${req.url} => ${res.statusCode}: An unhandled exception was caught inside ${name ? name : 'middleware'}: ${e}`)
      logger(req,res,e)
    }

    if(consoleLogLevel === 'none'){
      return
    }

    if(consoleLogLevel === 'all'){
      logConsole()
      return
    }

    if(consoleLogLevel === 'unhandled' && e.name !== 'ApiError'){
      logConsole()
      return
    }
  }

  // run with middleware
  run(handler: Handler): NextApiHandler {
    return async (req, res) => {

      await handler(req,res,end).catch(e => {
        
        // unknown runtime error that is not expected
        if(e.name !== 'ApiError'){
          this.onServerError(res)
        }
        
        this.handleLogs(req,res,this.logger,this.consoleLogLevel,this.name,e)
      })
    }
  }

  // create middleware
  create<T,Q>(handler: (req: NextApiRequest, res:NextApiResponse, end: () => void, args:T) => Promise<Q>){
    return (req:NextApiRequest, res: NextApiResponse, args: T) => {
      return handler(req,res,end,args)
    }
  }
}
