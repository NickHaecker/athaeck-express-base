import express, { Router } from "express";
import { GetLocalIP } from "../network";

export enum ExpressClassType {
    APP = "APP", ROUTER = "ROUTER", ROUTE = "ROUTE"
}
export enum ExpressRouteType {
    GET = "GET", POST = "POST", DELETE = "DELETE", PUT = "PUT"
}

export class BaseExpressRoute {
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

    public TakeRouter(router: BaseExpressRouter): void {
        router.AddRoute(this)
    }

    handleRequest = (_req: express.Request, _res: express.Response, _next: express.NextFunction) => {
        makeResponse(_res, 200, `---${this.route}`);
    }
}

export abstract class BaseExpressRoutingAddon {
    abstract AddRoute(route: BaseExpressRoute): void;
}
export function AddRoute(app: any, route: BaseExpressRoute): any {
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
export abstract class BaseExpressRouter extends BaseExpressRoutingAddon {
    protected app = Router();
    abstract path: string;
    abstract adapter: string;
    protected routeFactory: BaseExpressRouteFactory

    constructor() {
        super();
    }
    protected Log(): void {
        console.log(`----init adapter ${this.adapter} with path ${this.path} ----`);
    }

    get Path(): string {
        return this.path;
    }

    get Adapter(): string {
        return this.adapter;
    }

    get App(): Router {
        return this.app;
    }
    public AddExtension(extension: BaseExpressRouter): void {
        this.app.use(extension.path, extension.app);
    }
}

export abstract class BaseExpressApplication extends BaseExpressRoutingAddon {
    protected app = express();
    protected port: string | number;
    protected apiFactory: BaseExpressApiFactory

    constructor() {
        super();
        this.port = process.env.PORT || 3030;
    }

    abstract AddRoute(route: BaseExpressRoute): void;
    abstract initializeMiddleware(): void;

    public AddAdapter(adapter: BaseExpressRouter): void {
        this.app.use(adapter.Path, adapter.App);
    }

    Start(): void {
        this.app.listen(this.port, () => {
            const ip: string = GetLocalIP()
            console.log(`server started at http://${ip}:${this.port}`);
        });
    }
}

export function makeResponse(res: express.Response, code: number, body: any = null): void {
    res.status(code).json(body);
}
export abstract class BaseExpressApiFactory {
    protected adapter: any[] = []
    protected rootFolder: string
    constructor(root: string) {
        this.rootFolder = root
        this.CreateAdapter()
    }
    protected AddAdapter(adapter: any[]) {
        this.adapter = adapter
    }
    protected abstract CreateAdapter(): void
    public ConnectAdpater(application: BaseExpressApplication) {
        if (this.adapter.length === 0) {
            return;
        }
        for (const Adapter of this.adapter) {
            const adapter: BaseExpressRouter = new Adapter()
            application.AddAdapter(adapter);
        }
    }
}
export abstract class BaseExpressRouteFactory {
    protected routes: any[] = []
    protected rootFolder: string
    constructor(root: string) {
        this.rootFolder = root
        this.CreateRouts()
    }
    protected abstract CreateRouts(): void
    protected AddRoute(routes: any[]) {
        this.routes = routes
    }
    public ConnectRoutes(router: BaseExpressRouter): void {
        if (this.routes.length === 0) {
            return;
        }
        for (const Route of this.routes) {
            const route: BaseExpressRoute = new Route()
            route.TakeRouter(router)
        }
    }
}