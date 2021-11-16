import { 
  NextApiRequest as Req, 
  NextApiResponse as Res, 
  NextApiHandler as Handler 
} from 'next'

class End extends Error {
  readonly name: string
  constructor() {
    super('api-mw')
    this.name = 'api-mw'
  }
}
type Runner = ({req,res,e}: {req: Req, res: Res, e?: Error}) => Promise<void>
const end = () => { throw new End() }
const prod = process.env.NODE_ENV === 'production'

/**
 * Returns a new middleware that can be consumed inside any route from a RouteFactory
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
    param?: P
  ) => Promise<R>
) => {
  return (
    {
      req,
      res,
      param = undefined,
    }: {
      req: Req
      res: Res
      param?: P
    }
  ): Promise<R> => {
    return handler({req, res, end}, param)
  }
}

/**
 * Used to create Routes
 */
export class HandlerFactory {
  private readonly logger: Runner
  private readonly devLogger: Runner
  private readonly handleError: Runner
  
  /**
   * @param logger A function to persist requests and responses that runs in dev and prod
   * @param devLogger A function to debug requests and responses that runs in dev
   * @param handleServerError When a route throws, ans is not able to complete a req, this function is used to send a response
   * @returns An object that can be used to create next api routes that accept middleware
   * 
   * @default logger: Not implemented by default
   * @default devLogger: ${req.method} ${req.url} => ${res.statusCode} ${e}
   * @default handleServerError: res.status(500).json({ msg: 'Internal Server Error' })
   */
  constructor(
      {
        logger = async () => {},
        devLogger = async ({req,res,e}) => { 
          if(e) {
            console.error(`${req.method} ${req.url} => ${res.statusCode} ${e}`)
          } else {
            console.log(`${req.method} ${req.url} => ${res.statusCode}`)
          }
        },
        handleError = async ({ res }) => {
          res.status(500).json({ msg: 'Internal Server Error' })
        }
      }: {
        logger?: Runner
        devLogger?: Runner
        handleError?: Runner
      } = {}
    ){
      this.logger = logger
      this.devLogger = devLogger
      this.handleError = handleError
    }

    /**
    * Returns a new Next API route that middleware can be used inside of
    * @param route The handler for the route
    * @param route.req The NextApiRequest
    * @param route.res The NextApiResponse
    * @param end The function that must be called when the route is finished. 
    * @return A NextApiHandler that should be default exported from a file within page/api
   */ 
    getHandler(
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
   ): Handler {
     return async (req, res) => {
       await route({req, res, end })

       .then(() => {
          if (!prod) {
            console.error(`${req.method} ${req.url} => ${res.statusCode} did not call end()`)
          }
  
          end()
        })
 
       // when end is called, throw an error to release control back to this function
       .catch((errorOrEnd) => {
         const e = errorOrEnd?.name === 'api-mw' ? undefined : errorOrEnd
 
         try{

          if (e) {
            this.handleError({ req, res, e })
          }
          
          if (!prod) {
            this.devLogger({ req, res, e })
          }

          this.logger({ req, res, e })
           
         } catch (e) {
           console.error(e)
         }
       })
     }
   }
}