const {createPool} = require('mysql2');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "practise", //database name
    connectionLimit: 10
});

pool.query(`insert into shopping_list ( product_name, price, quantity) values("tea", 75, 3)`, (error, res, field)=>{
    if(error) return console.log(error);
    else
        return console.log(res);
});