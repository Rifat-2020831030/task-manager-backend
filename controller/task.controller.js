const express = require('express'),
    router = express.Router(),
    admin = require('../authMiddleware/admin'),
    user = require('../authMiddleware/user');

const db = require('../database');


// const people = ["Rahman", "hello@gmail.com", "admin", "admin", 100];

// http://localhost:3000/api/

// get all task
router.get('/get/task/',admin,  async (req, res)=>{
    db.query("SELECT * from task", (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
});

// get task by user
router.get('/get/task/:id',user, async (req, res)=>{
    db.query("SELECT * from task where user_id = ?",[req.params.id], 
    (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
});

// inserting task
router.post('/post/task/' , (req, res)=> {
    const {title, description, status, user_id} = req.body;
    db.query("INSERT INTO task values(?,?,?,?);", [title, description, status, user_id],
    (err, result, fields)=>{
        if(err) console.log(err);
        else   res.send(result);
        
    });
});

// update task
// id - > task_id -> req.params.id
router.put('/update/task/:id' , async (req, res)=> {
    // fetching old data
    db.query(
        `SELECT title,description,status FROM task WHERE task_id = ?` , [req.params.id]
        ,
        (err, oldData, f) =>{
            if(err) console.log('Logging from update op', err);

            let [{title, description, status}] = oldData;
            // console.log(oldData);
            // console.log(title,description,status);
            // new data is on req.body
            // assign new data if null
             title = title || req.body.title, 
             description = description || req.body.description ,
              status = status || req.body.status; 
              
              console.log(title,description,status);
            // updating with new data
            db.query(
                `UPDATE task SET title = ?, description = ?, status = ? WHERE task_id = ?;`,
                [
                  title,
                  description,
                  status,
                  req.params.id
                ]
              ,
            (err, result, fields)=>{
                if(err) console.log(err);
                else   res.send(result);
                
            });
        }
    )

    

});

// delete task
// req.params.id -> id
router.delete('/delete/task/:id', (req, res)=> {
    const log = db.query("DELETE FROM task WHERE task_id = ?;", [req.params.id],
    (err, result, fields)=>{
        if(err) console.log(err);
        else if(result.affectedRows){
             res.send(`task id ${req.params.id} has been deleted`);
             console.log(result);
        }
        // else{
        //     res.status(400).send(`There is no record with id: +?`,[req.params.id]);
        // }
        
    });
});

module.exports= router;