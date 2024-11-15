import express from "express";
import { UserDAO } from "./src/dao/userDAO";
import { UserRoutes } from "./src/routers/userRoutes";
import { ServiceRoutes } from "./src/routers/serviceRoutes";
import { TicketRoutes } from "./src/routers/ticketRoutes";
import { QueueRoutes } from "./src/routers/queueRoutes";
import { CounterRoutes } from "./src/routers/counterRoutes";

const morgan = require("morgan"); // logging middleware
const cors = require("cors");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session"); // Create the session

// init express
const app: express.Application = express();
const port: number = 3001;

// enable cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // To automatically decode incoming json

/*** Passport ***/
const DAO = new UserDAO();

// set up the "username and password" login strategy with a function to verify username and password
passport.use(
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    callback: any
  ) {
    const user = await DAO.getUser(username, password);
    if (!user) {
      return callback(null, false, {
        message: "Incorrect username or password",
      });
    }
    return callback(null, user);
  })
);

passport.serializeUser((user: any, callback: any) => {
  callback(null, user.id);
});

passport.deserializeUser(async function (id: number, callback: any) {
  try {
    const user = await DAO.getUserById(id);
    callback(null, user);
  } catch (err) {
    callback(err, null);
  }
});

const isLoggedIn = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

app.use(
  session({
    secret: "team10-project",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

// init passport
app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */
new UserRoutes(app, passport, isLoggedIn);
new ServiceRoutes(app);
new TicketRoutes(app);

new QueueRoutes(app, isLoggedIn);
new CounterRoutes(app, isLoggedIn);

/*** Other express-related instructions ***/
// activate the server
const server= app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export {app, server};