const express = require('express'),
    app = express(),
    parser = require('body-parser');
    

const db = require('./database'),
    taskController = require('./controller/task.controller'),
    userController = require('./controller/user.controller'),
    signin = require('./auth/signin');

// middlewire
app.use(parser.json());
app.use('/api', userController); 
app.use('/api', taskController); // routing all request to taskconroller 

db.query('SELECT * from task', (err, res, fields)=>{
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




// routes:

// all user info -> http://localhost:3000/api/userinfo admin
// create user -> http://localhost:3000/api/signup
// input : username, email, pass
// login -> http://localhost:3000/api/signin
// input : email, pass
// updating user -> 
// deleting user -> 

// get task by user (default)-> http://localhost:3000/api/get/task/:id
// get all task->  http://localhost:3000/api/get/task/  admin
// creating task-> http://localhost:3000/api/post/task/
// input : title, description, status, user_id
// updating task-> http://localhost:3000/api/update/task/:id
// deleting task-> http://localhost:3000/api/delete/task/:id  
