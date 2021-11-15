import { 
  NextApiRequest as Req, 
  NextApiResponse as Res, 
  NextApiHandler as Handler 
} from 'next'

type Logger = ({req,res,e}: {req: Req, res: Res, e?: Error}) => Promise<void>
type HandleServerError = ({ res,e }: { res: Res; e: Error }) => void
class End extends Error {
  readonly name: string
  constructor() {
    super('api-mw')
    this.name = 'api-mw'
  }
}
const end = () => { throw new End() }
const prod = process.env.NODE_ENV === 'production'
const defaultLogger: Logger = async () => {}
const defaultDevLogger: Logger = async ({req,res,e}) => { 
  if(e) {
    console.error(`${req.method} ${req.url} => ${res.statusCode} ${e}`)
    return
  }

  console.log(`${req.method} ${req.url} => ${res.statusCode}`)
}
const defaultHandleServerError: HandleServerError = ({ res }) => {
  res.status(500).json({ msg: 'Internal Server Error' })
}

/**
 * Configure a single route factory and use it to create all your middleware 
 * @param logger A function to persist requests and responses that runs in dev and prod
 * @param devLogger A function to debug requests and responses that runs in dev
 * @param handleServerError When a route throws, ans is not able to complete a req, this function is used to send a response
 * @returns An object that can be used to create next api routes that accept middleware
 * 
 * @default logger: async () => {}
 * @default devLogger: async ({req,res,e}) => console.error(`${req.method} ${req.url} => ${res.statusCode} ${e}`)
 * @default handleServerError: ({ res }) => { res.status(500).json({ msg: 'Internal Server Error' }) }
 */
export const createRouteFactory = (
  {
    logger = defaultLogger,
    devLogger = defaultDevLogger,
    handleServerError = defaultHandleServerError
  }: {
    logger?: Logger
    devLogger?: Logger
    handleServerError?: HandleServerError
  }
) => {
  return {
    /**
    * Returns a new Next API route that middleware can be used inside of
    * @param route The handler for the route
    * @param route.req The NextApiRequest
    * @param route.res The NextApiResponse
    * @param end The function that must be called when the route is finished. 
    * @return A NextApiHandler that should be default exported from a file within page/api
   */ 
    createHandler: (
     route: (
       {
         req,
         res,
         end
       }: {
         req: Req
         res: Res
         end: () => void
       }
     ) => Promise<void>
   ): Handler => {
     return async (req, res) => {
 
       await route({req, res, end })
 
       .then(() => {
         if (!prod) {
           console.error(`${req.method} ${req.url} => ${res.statusCode} did not call end()`)
         }
 
         end()
         })
 
       // when end is called, throw an error to release control back to this function
       .catch((e0) => {
         const e1 = e0?.name === 'api-mw' ? undefined : e0
 
         if (e1) {
           handleServerError({ res, e: e1 })
         }
 
         try{
 
           logger({ req, res, e: e1 })
           
           if (!prod) {
             devLogger({ req, res, e: e1 })
           }
 
         } catch (e2) {
           console.error(e2)
         }
       })
 
     }
   }
  }
}

/**
 * Returns a new middleware that can be called inside of any createRoute
 * @param handler The context of the request passed from the route that is handling the request
 * @param handler.req The NextApiRequest
 * @param handler.res The NextApiResponse
 * @param handler.end The function that must be called when the route is finished
 * @param handler.param A generic, optimal parameter that you can use to pass args to your middleware
 * @returns A new middleware function that can be used within any createRoute
 */
 export const createMiddleware = <R, P = void>(
  handler: (
    {
      req,
      res,
      end,
    }: {
      req: Req
      res: Res
      end: () => void
    },
    param: P
  ) => Promise<R>
) => {
  return (
    req: Req,
    res: Res,
    param: P
  ): Promise<R> => {
    return handler({req, res, end}, param)
  }
}