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
    protected _route: string;
    protected _routeType: ExpressRouteType;

    constructor(route: string, routeType: ExpressRouteType) {
        console.log("init");
    }

    get route(): string {
        return this._route;
    }

    get routeType(): ExpressRouteType {
        return this._routeType;
    }

    handleRequest = (_req: express.Request, _res: express.Response, _next: express.NextFunction) => {
        makeResponse(_res, 200, `this is ${this._route}`);
    }
}

export abstract class ExpressRoutingAddon {
    abstract createRoutes(): void;
    intializeRoutes(app: any, routes: ExpressRoute[]): any {

        return app;
    }
}

export abstract class ExpressRouter extends ExpressRoutingAddon {
    protected _app = Router();
    protected _routes: ExpressRoute[] = [];
    protected _router: ExpressRouter[] = [];

    protected _path: string;
    protected _adapter: string;

    constructor(path: string, adapter: string) {
        super();

    }

    get path(): string {
        return this._path;
    }

    get adapter(): string {
        return this._adapter;
    }

    get app(): any {
        return this._app;
    }

    abstract createRoutes(): void;

    protected initializeExtensions(app: any, adapter: string): any {

        return app;
    }


}

export abstract class ExpressApplication extends ExpressRoutingAddon {

    protected _app = express();
    protected _routes: ExpressRoute[] = [];
    protected _router: ExpressRouter[] = [];

    protected _port: string | number;

    constructor() {
        super();

    }

    abstract createRoutes(): void;
    abstract initializeMiddlewares(): void;
    initializeAdapter(app: any, router: ExpressRouter[]): any {

        return app;
    }
    createAdapter(router: ExpressRouter[], dir: any): void {

    }
    main(): void {

    }
}

export function makeResponse(res: express.Response, code: number, body: any = null): void {
    res.status(code).json(body);
}