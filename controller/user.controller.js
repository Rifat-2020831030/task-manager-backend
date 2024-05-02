const express = require('express'),
    router = express.Router();

const db = require('../database');

// creating user
router.post('/', (req, res)=>{ // req and res obj comes from nodejs
    const {username, email, pass, role ,user_id} = req.body;

    db.query("INSERT INTO profile values(?,?,?,?,?);", [username, email, pass, role, user_id],
    (err, result, fields)=>{ // err and result comes from database
        if(err) console.log(err);
        else 
            res.send(`User ${username} with id ${user_id} has been added to the database\n`);
    });
});

// getting all user

router.get('/', (req, res)=>{
    db.query("SELECT * from profile", (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
})
// updating user

// deleting user

module.exports = router;