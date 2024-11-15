import express from "express";
import { serviceController } from "../controllers/serviceController";
import { param } from "express-validator"
import ErrorHandler from "../helper";
import { ServiceType } from "../components/service";
import { ServiceListEmptyError, ServiceNotFoundError } from "../errors/serviceErrors";

class ServiceRoutes {
    private app: express.Application
    private controller: serviceController 
    private errorHandler: ErrorHandler

    constructor(app: express.Application) {
        this.app = app;
        this.controller = new serviceController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    initRoutes(): void {
        this.app.get("/api/getAllServices", (req: any, res: any, next: any) => this.controller.getAllServices()
        .then((services: ServiceType[]) => res.status(200).json(services))
        .catch((err: Error) => res.status(500).json(err)))

        this.app.get("/api/getService/:serviceName", 
            param("serviceName").notEmpty().isString(),
            this.errorHandler.validateRequest,
        (req: any, res: any, next: any) => this.controller.getServiceByName(req.params.serviceName)
        .then((service: ServiceType) => res.status(200).json(service))
        .catch((err: Error) => {
            if(err instanceof ServiceNotFoundError) res.status(err.customCode).json(err);
            else res.status(500).json(err);
        }))

        this.app.delete("/api/deleteServices", (req: any, res: any, next: any) => this.controller.deleteAllServices()
        .then(() => res.status(200).json())
        .catch((err: Error) => {
            if(err instanceof ServiceListEmptyError) res.status(err.customCode).json(err);
            else res.status(500).json(err);
        }))
    }
}

export { ServiceRoutes };