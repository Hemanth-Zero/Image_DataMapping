const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'View')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (simple server-side sessions)
app.use(session({
  secret: 'change-this-secret-to-a-secure-random-value',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));


const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',       
  database: 'projecti',    
  password: 'mypostgres', 
  port: 5432,              
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL as superuser!"))
  .catch(err => console.error("Connection error:", err));

module.exports = pool;

// Routes
const pageRoutes = require('./Control/Routes/pageRoutes');
const userRoutes = require('./Control/Routes/userRoutes');

app.use('/', pageRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});