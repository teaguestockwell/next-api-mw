import { NextApiMw } from "../../src/index";

const mw = new NextApiMw({
  // you can create many mw factories if you want a different logging behavior for each 
  // the name helps you keep track of them in the logs
  // alternatively you can export a single instance of the mw factory
  // and use a switch statement for req.url inside of the loggers
  name: 'mw1',
  
  // by default, if you dont pass a devLogger it will log:
  // mw-mw1: GET /api/class => 400 ${uncaught error?}
  // for every request during development
  devLogger: async ({req,res,e,name}) => {},

  // persist requests based on some condition here
  logger: async ({req,res,e,name}) => {
    console.log(`mw-${name}: ${req.method} ${req.url} => ${res.statusCode}`);
    
    // uhh oh, the server threw an error. better hang on to that and see what happened
    if(e){
      console.error(e);
    }
  },

  // if the server throws an error and is unable to complete a request
  // the middleware will use this to complete the request
  onServerError: ({res, e}) => {
    res.status(500).json({msg: 'oops!'});
  },
});

const usingFooQS = mw.create(async (req, res,end) => {
  const {foo} = req.query;

  if(!foo || typeof foo !== 'string'){
    res.status(400).json({msg: 'invalid foo'});
    end();
  }

  return foo as string;
})

export default mw.run(async (req, res, end) => {
  const foo = await usingFooQS(req, res);
  res.status(200).json({foo});
  end();
})