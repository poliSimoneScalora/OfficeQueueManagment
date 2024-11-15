import express from 'express';
import { QueueController } from '../controllers/queueController';
import { CounterController } from '../controllers/counterController';
import { Ticket } from '../components/ticket';
import { Utilities } from '../utilities';
import { Counter } from '../components/counter';


/**
 * Represents a class that defines the routes for handling queue.
 */
class QueueRoutes {
    private app: express.Application;
    private isLoggedIn: (req: any, res: any, next: any) => any;
    private controller: QueueController;
    private controllerCounter: CounterController;
    private utilities: Utilities;

    constructor(app: express.Application, isLoggedIn: (req: any, res: any, next: any) => any) {
        this.app = app;
        this.isLoggedIn= isLoggedIn;
        this.controller = new QueueController();
        this.controllerCounter = new CounterController();
        this.utilities= new Utilities();
        this.initRoutes();
    }

    initRoutes(): void{  

        this.app.get('/api/tickets',
            (req: any, res: any, next: any) => this.controller.getAllTicketsInQueues()
                .then((users: Ticket[]) => res.status(200).json(users))
                .catch((err: any) => next(err))
        );

        /**
         * Route for saving served current customer and retrieving next customer to call to a specific counter.
         * It requires as request parameter the counterID of the counter that has finished.
         * It returns the code of the customer to call to this counter.
         */
        this.app.get('/api/served/:counterID', this.isLoggedIn, this.utilities.isOfficer, this.utilities.isEnabled, async(req: any, res: any) => {
            try {
                const counter: Counter = await this.controllerCounter.getCounter(req.user.id);
                if (counter.id!=req.params.counterID){
                    res.status(401).json({error: 'Unauthorized'});
                }
                else{
                    const customer: number = await this.controller.setServed(req.params.counterID);
                    res.status(200).json(customer);
                } 
            } catch {
              res.status(500).json({error: 'Internal server error'});
            }
        });


        /**
         * Route for saving not served current customer and retrieving next customer to call to a specific counter.
         * It requires as request parameter the counterID of the counter that has rejected.
         * It returns the code of the customer to call to this counter.
         */
        this.app.get('/api/notserved/:counterID', this.isLoggedIn, this.utilities.isOfficer, this.utilities.isEnabled, async(req: any, res: any) => {
            try {
                const counter: Counter = await this.controllerCounter.getCounter(req.user.id);
                if (counter.id!=req.params.counterID){
                    res.status(401).json({error: 'Unauthorized'});
                }
                else{
                    const customer: number = await this.controller.setNotServed(req.params.counterID);
                    res.status(200).json(customer);
                }
            } catch {
              res.status(500).json({error: 'Internal server error'});
            }
        });

    }
}

export {QueueRoutes};