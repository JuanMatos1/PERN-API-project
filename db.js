const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "password",
    port: 5432,
    database: "perntodo",
});

module.exports = pool;
