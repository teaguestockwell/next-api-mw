import { HandlerFactory } from "../src"
export { usingFooQS } from "./usingFooQs"
export { usingMethods } from "./usingMethods"
export { usingMany } from "./usingMany"
export { usingYup } from './usingYup'

export const handlerFactory = new HandlerFactory({
  handleError: async ({req,res,e}) => {
    res.status(500).json({ msg: 'server error' })
  },
  logger: async ({req,res,e}) => {
    
  },
  rootMiddleware: async ({req, res, end}) => {
    console.log(req.url)
    if(req.url.includes('token')){
      res.status(200).json({msg: 'token-accepted'})
      end()
    }
  }
})
