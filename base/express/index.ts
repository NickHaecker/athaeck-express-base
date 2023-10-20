import express, { Router } from "express";
import config from "config";
import path from "path";
export enum ExpressClassType {
    APP = "APP", ROUTER = "ROUTER", ROUTE = "ROUTE"
}
export enum ExpressRouteType {
    GET = "GET", POST = "POST", DELETE = "DELETE", PUT = "PUT"
}

export class ExpressRoute {
    protected route: string;
    protected routeType: ExpressRouteType;

    constructor(route: string, routeType: ExpressRouteType) {
        this.route = route;
        this.routeType = routeType;
        console.log(`----requested ${this.route} with method ${this.routeType} ----`);
    }

    public get Route(): string {
        return this.route;
    }

    public get RouteType(): ExpressRouteType {
        return this.routeType;
    }

    handleRequest = (_req: express.Request, _res: express.Response, _next: express.NextFunction) => {
        makeResponse(_res, 200, `---${this.route}`);
    }
}

export abstract class ExpressRoutingAddon {
    abstract AddRoute(route: ExpressRoute): void;
}
export function AddRoute(app: any, route: ExpressRoute): any {
    switch (route.RouteType) {
        case ExpressRouteType.GET:
            app.get(route.Route, route.handleRequest);
            break;
        case ExpressRouteType.POST:
            app.post(route.Route, route.handleRequest);
            break;
        case ExpressRouteType.DELETE:
            app.delete(route.Route, route.handleRequest);
            break;
        default:
            app.put(route.Route, route.handleRequest);
            break;
    }
    return app;
}
export abstract class ExpressRouter extends ExpressRoutingAddon {
    protected app = Router();
    protected path: string;
    protected adapter: string;

    constructor(path: string, adapter: string) {
        super();
        this.path = path;
        this.adapter = adapter;
        console.log(`----init adapter ${this.adapter} with path ${path} ----`);
    }

    get Path(): string {
        return this.path;
    }

    get Adapter(): string {
        return this.adapter;
    }

    get App(): any {
        return this.app;
    }
    public AddExtension(extension: ExpressRouter): void {
        this.app.use(extension.path, extension.app);
    }
    abstract AddRoute(route: ExpressRoute): void;
}

export abstract class ExpressApplication extends ExpressRoutingAddon {
    protected app = express();
    protected port: string | number;

    constructor() {
        super();
        this.port = process.env.PORT || 3030;
    }

    abstract AddRoute(route: ExpressRoute): void;
    abstract initializeMiddleware(): void;

    public AddAdapter(adapter: ExpressRouter): void {
        this.app.use(adapter.Path, adapter.App);
    }

    main(): void {

    }
}

export function makeResponse(res: express.Response, code: number, body: any = null): void {
    res.status(code).json(body);
}