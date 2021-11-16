import { HandlerFactory } from "../src"
export { usingFooQS } from "./usingFooQs"
export { usingMethods } from "./usingMethods"
export { usingMany } from "./usingMany"
export { usingYup } from './usingYup'

export const handlerFactory = new HandlerFactory({
  handleError: async ({req,res,e}) => {
    res.status(500).json({ msg: 'server error' })
  },
  devLogger: async ({req,res,e}) => {
    
  },
  logger: async ({req,res,e}) => {
    
  }
})
