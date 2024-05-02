const express = require('express'),
    router = express.Router();

const db = require('../database');

const crud = require('../query implementation/query');

// const people = ["Rahman", "hello@gmail.com", "admin", "admin", 100];

// http://localhost:3000/api/

// get all task
router.get('/get/task/',  async (req, res)=>{
    db.query("SELECT * from task", (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
});

// get task by id
router.get('/get/task/:id',  async (req, res)=>{
    db.query("SELECT * from task where task_id = ?",[req.params], 
    (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
});

// inserting task
router.post('/post/task/' , (req, res)=> {
    const {title, description, status, user_id, task_id} = req.body;
    db.query("INSERT INTO task values(?,?,?,?,?);", [title, description, status, user_id,task_id],
    (err, result, fields)=>{
        if(err) console.log(err);
        else   res.send(result);
        
    });
});

// update task
router.patch('/update/task/:id' , (req, res)=> {
    const {title, description, status, user_id, task_id} = req.body;
    db.query(`UPDATE task 
                SET title = ?, description = ?, status = ?
                where task_id= ?, title IS NOT NULL, description IS NOT NULL, status IS NOT NULL;`
                ,[title, description, status, req.params.id],
    (err, result, fields)=>{
        if(err) console.log(err);
        else   res.send(result);
        
    });
});

// delete task
// req.params.id -> id
router.delete('/delete/task/:id' , (req, res)=> {
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