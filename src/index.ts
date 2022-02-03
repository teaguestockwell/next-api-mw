import type {
  NextApiRequest as Req,
  NextApiResponse as Res,
  NextApiHandler as Handler,
} from 'next'

class End extends Error {
  readonly name: string
  constructor() {
    super('api-mw')
    this.name = 'api-mw'
  }
}

type Runner = ({
  req,
  res,
  e,
}: {
  req: Req
  res: Res
  e?: Error
}) => Promise<void>

type RouteProps = {
  req: Req
  res: Res
  end: () => void
}

type Route = (props: RouteProps) => Promise<void>

const end = () => {
  throw new End()
}

const devError = (e:any) => {
  if(process.env.NODE_ENV === 'production'){
    console.error(e)
  }
}

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
  return ({
    req,
    res,
    param = undefined,
  }: {
    req: Req
    res: Res
    param?: P
  }): Promise<R> => {
    return handler({ req, res, end }, param)
  }
}

/**
 * Used to create Routes
 */
export class HandlerFactory {
  private readonly logger: Runner
  private readonly handleError: Runner
  private readonly rootMiddleware: Route

  /**
   * @param logger A function to persist requests and responses
   * @param handleError When a route throws, and is not able to complete a req, this function is used to send a response
   * @param rootMiddleware The middleware that is used to handle all requests
   *
   * @default logger: Not implemented by default
   * @default handleError: res.status(500).json({ msg: 'Internal Server Error' })
   * @default rootMiddleware: Not implemented by default
   * 
   * @returns An object that can be used to create next api routes that accept middleware
   */
  constructor({
    logger = async ({ req, res, e }) => {
      if (e) {
        console.error(`${req.method} ${req.url} => ${res.statusCode} ${e}`)
      } else {
        console.log(`${req.method} ${req.url} => ${res.statusCode}`)
      }
    },
    handleError = async ({ res }) => {
      res.status(500).json({ msg: 'Internal Server Error' })
    },
    rootMiddleware = async ({ end }) => {
      end()
    },
  }: {
    logger?: Runner
    handleError?: Runner
    rootMiddleware?: Route
  } = {}) {
    this.logger = logger
    this.handleError = handleError
    this.rootMiddleware = rootMiddleware
  }

  private async fulfillRoute({
    promise,
    logger,
    handleError,
    req,
    res,
    noEndMsg,
  }: {
    promise: Promise<void>
    logger: Runner
    handleError: Runner
    req: Req
    res: Res
    noEndMsg: string
  }) {
    return promise
      .then(() => {
        devError(noEndMsg + ' did not call end')
        end()
      })
      .catch((maybeError) => {
        const e = maybeError?.name === 'api-mw' ? undefined : maybeError
        try {
          if (e) {
            handleError({ req, res, e })
          }
          logger({ req, res, e })
        } catch (err) {
          devError(err)
        }

        return !!e
      })
  }

  /**
   * Returns a new Next API route that middleware can be used inside of
   * @param route The handler for the route
   * @param route.req The NextApiRequest
   * @param route.res The NextApiResponse
   * @param end The function that must be called when the route is finished.
   * @return A NextApiHandler that should be default exported from a file within page/api
   */
  getHandler(route: Route): Handler {
    return async (req, res) => {
      const isComplete = await this.fulfillRoute({
        promise: this.rootMiddleware({req,res,end}),
        logger: this.logger,
        handleError: this.handleError,
        req,
        res,
        noEndMsg: 'rootMiddleware',
      })

      if(!isComplete){
        await this.fulfillRoute({
          req,
          res,
          promise: route({ req, res, end }),
          noEndMsg: `${req.method} ${req.url} => ${res.statusCode}`,
          handleError: this.handleError,
          logger: this.logger,
        }) 
      }
    }
  }
}
