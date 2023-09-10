const express = require("express");
const next = require("next");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const pool = require('./routes/db');
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = new Sequelize('ecommerce_db', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres'
});
const {getUserByEmail, getUserById} = require('./get_from_accounts_db');
const initializePassport = require('./passport_config');
initializePassport(passport, getUserByEmail, getUserById);

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    pool.connect()
    .then(() => {
      console.log('Connected to the database');
      
    })
    .catch((err) => {
      console.error('Error connecting to the database', err);
    });

    

    const showRoutes = require("./routes/index.js");

    server.use(express.json());

    server.use(express.urlencoded({ extended: false }));

    server.use(flash());
    
    server.use(
      session({
        secret: "secret key",
        
        resave: false,
        saveUninitialized: false
      })
    );

    server.use(passport.initialize());
    server.use(passport.session());

    server.use("/api", showRoutes(server));

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.log(intra);
    console.error(ex.stack);
    process.exit(1);
  });

