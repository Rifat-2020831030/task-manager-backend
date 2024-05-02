const {createPool} = require('mysql2');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "task manager", //database name
    connectionLimit: 10
});

module.exports = pool;