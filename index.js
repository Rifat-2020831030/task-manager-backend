const express = require('express'),
    app = express(),
    parser = require('body-parser');

const db = require('./database'),
    taskController = require('./controller/task.controller'),
    userController = require('./controller/user.controller');

// middlewire
app.use(parser.json());
app.use('/api/user', userController); 
app.use('/api', taskController); // routing all request to taskconroller 

db.query('SELECT * from profile', (err, res, fields)=>{
    if(err){
        console.log(`Database connection failed! \n`+err);
    }
    else{
        console.log(`Database connection successful!`);
        // console.log(res);
        // after backend is connected with db run the backend server
        app.listen(3000, 
            ()=>  console.log(`server is running on http://localhost:3000`)
        );
    }
})