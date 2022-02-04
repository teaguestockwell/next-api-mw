import type { NextApiRequest as Req, NextApiResponse as Res, NextApiHandler as Handler } from 'next';
declare type Runner = ({ req, res, e, }: {
    req: Req;
    res: Res;
    e?: Error;
}) => Promise<void>;
declare type RouteProps = {
    req: Req;
    res: Res;
    end: () => void;
};
declare type Route = (props: RouteProps) => Promise<void>;
/**
 * Returns a new middleware that can be consumed inside any route from a RouteFactory
 * @param handler The context of the request passed from the route that is handling the request
 * @param handler.req The NextApiRequest
 * @param handler.res The NextApiResponse
 * @param handler.end The function that must be called when the route is finished
 * @param handler.param A generic, optimal parameter that you can use to pass args to your middleware
 * @returns A new middleware function that can be used within any createRoute
 */
export declare const createMiddleware: <R, P = void>(handler: ({ req, res, end, }: {
    req: Req;
    res: Res;
    end: () => void;
}, param?: P | undefined) => Promise<R>) => ({ req, res, param, }: {
    req: Req;
    res: Res;
    param?: P | undefined;
}) => Promise<R>;
/**
 * Used to create Routes
 */
export declare class HandlerFactory {
    private readonly logger;
    private readonly handleError;
    private readonly rootMiddleware;
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
    constructor({ logger, handleError, rootMiddleware, }?: {
        logger?: Runner;
        handleError?: Runner;
        rootMiddleware?: Route;
    });
    /**
     * @returns A boolean denoting if the route is complete
     */
    private fulfillRoute;
    /**
     * Returns a new Next API route that middleware can be used inside of
     * @param route The handler for the route
     * @param route.req The NextApiRequest
     * @param route.res The NextApiResponse
     * @param end The function that must be called when the route is finished.
     * @return A NextApiHandler that should be default exported from a file within page/api
     */
    getHandler(route: Route): Handler;
}
export {};
