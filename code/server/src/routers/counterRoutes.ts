import express from "express";
import { CounterController } from "../controllers/counterController";
import { Counter } from "../components/counter";
import { Utilities } from "../utilities";

/**
 * Represents a class that defines the routes for handling counter.
 */
class CounterRoutes {
  private app: express.Application;
  private isLoggedIn: (req: any, res: any, next: any) => any;
  private controller: CounterController;
  private utilities: Utilities;

  constructor(
    app: express.Application,
    isLoggedIn: (req: any, res: any, next: any) => any
  ) {
    this.app = app;
    this.isLoggedIn = isLoggedIn;
    this.controller = new CounterController();
    this.utilities = new Utilities();
    this.initRoutes();
  }

  initRoutes(): void {
    /**
     * Route for retrieving a counter associated to a user.
     * It requires the user to be logged in and to be either an officier.
     * It requires as request parameter the userID, a number.
     * It returns the Counter objects.
     */
    this.app.get(
      "/api/counter/:userID",
      this.isLoggedIn,
      this.utilities.isOfficer,
      async (req: any, res: any) => {
        try {
          console.log("ok");
          const counter: Counter = await this.controller.getCounter(
            req.params.userID
          );
          res.status(200).json(counter);
        } catch (err: any) {
          if (err.message == "Not Found") res.status(404).json(err);
          else res.status(500).json(err);
        }
      }
    );
    /*get current ticket for a given counter */
    this.app.get(
      "/api/counter/:counterId/current",
      this.isLoggedIn,
      this.utilities.isOfficer,
      async (req: any, res: any) => {
        try {
          console.log("ok");
          const ticket: any = await this.controller.getCurrentTicket(
            req.params.counterId
          );
          res.status(200).json(ticket);
          console.log("hello3");
        } catch (err: any) {
          if (err.message == "Not Found") res.status(404).json(err);
          else res.status(500).json(err);
        }
      }
    );
  }
}

export { CounterRoutes };
