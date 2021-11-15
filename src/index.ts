import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

type Logger = (
  p: {
    req: NextApiRequest;
    res: NextApiResponse;
    e?: Error;
    name: string;
  }
) => Promise<void>

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  end: () => void,
) => Promise<void>;

class ApiClose extends Error {
  readonly name: string;

  constructor() {
    super('ApiClose');
    this.name = 'ApiClose';
  }
}

const end = () => {
  throw new ApiClose();
};

type MiddlewareParams = {
  name: string;
  devLogger: Logger;
  onServerError: (p: {res: NextApiResponse, e:Error}) => void;
  logger: Logger;
}

const defaults: MiddlewareParams = {
  name: '',

  logger: async () => {},

  onServerError: ({res}) => {
    res.status(500).json({msg: 'Internal Server Error'});
  },

  devLogger: async ({req,res,e,name}) => {

    const method = req.method ?? 'no method'
    const url = req.url ?? 'no url'
    const status = res.statusCode ?? 'no status'

    if(e){
      console.error(`${method} ${url} => ${status}: An unhandled exception was caught inside ${name}: ${e}`)
    } else {
      console.log(`${method} ${url} => ${status}`)
    }
  }
}
export class NextApiMw {
  params: MiddlewareParams 
  
  constructor(p?: Partial<MiddlewareParams>) {
    this.params = {
      name: p?.name ?? defaults.name,
      logger: p?.logger ?? defaults.logger,
      devLogger: p?.devLogger ?? defaults.devLogger,
      onServerError: p?.onServerError ?? defaults.onServerError,
    }
  }

  // run with middleware
  run(handler: Handler): NextApiHandler {
    return async (req, res) => {
      // run the provided handler for the route
      // and send a response in a middleware of the handler
      // after the res is send calling end() will throw a ApiClose error
      // this releases control back to this function
      await handler(req, res, end)
      .then(() => {
        if(process.env.NODE_ENV !== 'production') {
          console.log(`${req.method} ${req.url} => ${res.statusCode}: You may have forgotten to call end() inside ${this.params.name} after sending the response`)
        }
        end();
      })
      .catch((e) => {
        
        // an unexpected error occurred, the handler or it's middleware
        // where not able to send the request, so send it using the onServerError fallback
        const unHandledError = e?.name === 'ApiClose' ? null : e

        if (unHandledError) {
          this.params.onServerError({res, e: unHandledError});
        }

        const { name } = this.params;
        
        // callback to the provided logger
        this.params.logger({req, res, name, e: unHandledError}).catch((err) => {
          console.error(
            `${this.params.name}-logger: ${err}`
          )
        })

        // a helper for better visibility during development
        // that way if an unexpected error ocurred this top level error boundary will display it
        if(process.env.NODE_ENV !== 'production'){
          this.params.devLogger({req, res, name, e: unHandledError}).catch((err) => {
            console.error(
              `${this.params.name}-devLogger: ${err}`
            )
          });
        }
      })
    };
  }

  // create a new middleware
  // expose the end callback to the newly created middleware
  // so it can stop the middleware stack if it decides to handle a request
  create<T, Q>(
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      end: () => void,
      args?: T
    ) => Promise<Q>
  ) {

    // when a middleware is consumed by by calling it in another handler or middleware
    // pass it's argument and return types to the consumer 
    return (req: NextApiRequest, res: NextApiResponse, args?: T): Promise<Q> => {
      return handler(req, res, end, args);
    };
  }
}

// you may create your own middleware factory 
// by instantiating the Middleware class with a logger and onServerError and exporting it
// or you may use an instance of the default factory
export const nextApiMw = new NextApiMw();