import { __awaiter, __extends, __generator } from "tslib";
var End = /** @class */ (function (_super) {
    __extends(End, _super);
    function End() {
        var _this = _super.call(this, 'api-mw') || this;
        _this.name = 'api-mw';
        return _this;
    }
    return End;
}(Error));
var end = function () {
    throw new End();
};
var devError = function (e) {
    if (process.env.NODE_ENV === 'production') {
        console.error(e);
    }
};
/**
 * Returns a new middleware that can be consumed inside any route from a RouteFactory
 * @param handler The context of the request passed from the route that is handling the request
 * @param handler.req The NextApiRequest
 * @param handler.res The NextApiResponse
 * @param handler.end The function that must be called when the route is finished
 * @param handler.param A generic, optimal parameter that you can use to pass args to your middleware
 * @returns A new middleware function that can be used within any createRoute
 */
export var createMiddleware = function (handler) {
    return function (_a) {
        var req = _a.req, res = _a.res, _b = _a.param, param = _b === void 0 ? undefined : _b;
        return handler({ req: req, res: res, end: end }, param);
    };
};
/**
 * Used to create Routes
 */
var HandlerFactory = /** @class */ (function () {
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
    function HandlerFactory(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.logger, logger = _c === void 0 ? function (_a) {
            var req = _a.req, res = _a.res, e = _a.e;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (e) {
                        console.error(req.method + " " + req.url + " => " + res.statusCode + " " + e);
                    }
                    else {
                        console.log(req.method + " " + req.url + " => " + res.statusCode);
                    }
                    return [2 /*return*/];
                });
            });
        } : _c, _d = _b.handleError, handleError = _d === void 0 ? function (_a) {
            var res = _a.res;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    res.status(500).json({ msg: 'Internal Server Error' });
                    return [2 /*return*/];
                });
            });
        } : _d, _e = _b.rootMiddleware, rootMiddleware = _e === void 0 ? function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); } : _e;
        this.logger = logger;
        this.handleError = handleError;
        this.rootMiddleware = rootMiddleware;
    }
    /**
     * @returns A boolean denoting if the route is complete
     */
    HandlerFactory.prototype.fulfillRoute = function (_a) {
        var promise = _a.promise, logger = _a.logger, handleError = _a.handleError, req = _a.req, res = _a.res, isRoot = _a.isRoot;
        return __awaiter(this, void 0, void 0, function () {
            var maybeError_1, e;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promise];
                    case 1:
                        _b.sent();
                        if (!isRoot) {
                            devError(req.method + " " + req.url + " => " + res.statusCode + " did not call end()");
                            end();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        maybeError_1 = _b.sent();
                        e = (maybeError_1 === null || maybeError_1 === void 0 ? void 0 : maybeError_1.name) === 'api-mw' ? undefined : maybeError_1;
                        if (e) {
                            handleError({ req: req, res: res, e: e }).catch(function (e) { return devError("Handle error threw " + e); });
                        }
                        logger({ req: req, res: res, e: e }).catch(function (e) { return devError("The logger threw " + e); });
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Returns a new Next API route that middleware can be used inside of
     * @param route The handler for the route
     * @param route.req The NextApiRequest
     * @param route.res The NextApiResponse
     * @param end The function that must be called when the route is finished.
     * @return A NextApiHandler that should be default exported from a file within page/api
     */
    HandlerFactory.prototype.getHandler = function (route) {
        var _this = this;
        return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var isComplete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fulfillRoute({
                            promise: this.rootMiddleware({ req: req, res: res, end: end }),
                            logger: this.logger,
                            handleError: this.handleError,
                            req: req,
                            res: res,
                            isRoot: true,
                        })];
                    case 1:
                        isComplete = _a.sent();
                        if (!!isComplete) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fulfillRoute({
                                req: req,
                                res: res,
                                promise: route({ req: req, res: res, end: end }),
                                handleError: this.handleError,
                                logger: this.logger,
                                isRoot: false,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    };
    return HandlerFactory;
}());
export { HandlerFactory };
//# sourceMappingURL=index.js.map