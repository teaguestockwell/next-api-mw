import {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'

interface AbortParams {
  status: number
  body: any
}

type Logger = (abortParams: AbortParams) => Promise<void>

type Abort = (params: AbortParams) => void

type ConsoleLogLevel = 'all' | 'unhandled' | 'none'

type Handler = (req: NextApiRequest, res: NextApiResponse, abort?: Abort) => Promise<void>

export class ApiError extends Error {
  readonly status: number
  readonly body: any
  readonly name: string

  constructor({status, body}: {status: number; body: any}) {
    super('ApiError')
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

export class Middleware {
  readonly logger: Logger
  readonly errorRes: AbortParams
  readonly consoleLogLevel: ConsoleLogLevel
  readonly name: string

  constructor(params?: {logger?: Logger; abortDefault?: AbortParams; consoleLogLevel?: ConsoleLogLevel, name?: string}) {
    if(!params){
      this.logger = async () => {}
      this.errorRes = {status: 500, body: {msg: 'Internal server error'}}
      this.consoleLogLevel = 'all'
      this.name = ''
    } else {
      this.logger = params.logger ? params.logger : async () => {}
      this.errorRes = params.abortDefault ? params.consoleLogLevel as any: {status: 500, body: {msg: 'Internal server error'}}
      this.consoleLogLevel = params.consoleLogLevel ? params.consoleLogLevel : 'unhandled'
      this.name = params.name ? params.name : ''
    }
  }

  // stop execution of the middleware call stack and pass control to onabort 
  private abort(params: AbortParams){
    throw new ApiError(params)
  }

  // thrown on purpose ex: bad req body, wrong method
  private handleApiError(e: ApiError, res:NextApiResponse, ctx:any){
    if(ctx.consoleLogLevel === 'all'){
      console.info(`middleware${ctx.name ? ' ' + ctx.name  : ''}: status ${e.status}, body ${e.body}`)
    }
    ctx.logger(e)
    res.status(e.status).json(e.body)
  }

  // unknown runtime error that is not expected
  private handleServerError(e: any, res:NextApiResponse, ctx:any){

    if(ctx.consoleLogLevel !== 'none'){
      console.error(`middleware${ctx.name ? ' ' + ctx.name  : ''}: ${e}`)
    }
    ctx.logger({status: ctx.errorRes.status, body: {clientError: ctx.errorRes.body, serverError: String(e)}})
    res.status(ctx.errorRes.status).json(ctx.errorRes.body)
  }

  // run with middleware
  handle(handler: Handler): NextApiHandler {
    return async (req, res) => {
      handler(req,res,this.abort).catch(e => {
        const catcher = e.name === 'ApiError' ? this.handleApiError : this.handleServerError
        catcher(e, res,this)
      })
    }
  }

  // create middleware
  produce<T,Q>(handler: (req: NextApiRequest, res: NextApiResponse, abort: Abort, args:T) => Promise<Q>){
   return (req:NextApiRequest, res:NextApiResponse, args: T) => handler(req,res,this.abort, args)
  }
}
