import express from "express";
import { ticketController } from "../controllers/ticketController";
import ErrorHandler from "../helper";
import { body } from "express-validator";
import { Ticket } from "../components/ticket";
import { ServiceNotFoundError } from "../errors/serviceErrors";
import { TicketListEmpty, TicketNotFoundError } from "../errors/ticketErrors";

class TicketRoutes {
    private app: express.Application
    private controller: ticketController
    private errorHandler: ErrorHandler

    constructor(app: express.Application) {
        this.app = app;
        this.controller = new ticketController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    initRoutes(): void {
        this.app.post("/api/addTicket",
            body("serviceName").notEmpty().isString(),
            this.errorHandler.validateRequest,
        (req: any, res: any, next: any) => this.controller.addTicket(req.body.serviceName)
        .then((ticket: Ticket) => res.status(200).json(ticket))
        .catch((err: Error) => {
            if(err instanceof ServiceNotFoundError || err instanceof TicketNotFoundError) res.status(err.customCode).json(err);
            else res.status(500).json(err);
        }))

        this.app.get("/api/getAllTickets", (req: any, res: any, next: any) => this.controller.getAllTickets()
        .then((tickets: Ticket[]) => res.status(200).json(tickets))
        .catch((err: Error) => res.status(200).json(err)));

        this.app.delete("/api/deleteAllTickets", (req: any, res: any, next: any) => this.controller.deleteAllTickets()
        .then(() => res.status(200).json())
        .catch((err: Error) => {
            if(err instanceof TicketListEmpty) res.status(err.customCode).json(err);
            else res.status(500).json(err);
        }))
    }
}

export { TicketRoutes };