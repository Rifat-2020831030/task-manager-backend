const express = require('express'),
    router = express.Router(),
    admin = require('../authMiddleware/admin'),
    user = require('../authMiddleware/user');

const encrypt = require("bcryptjs"),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv');
    dotenv.config();

const db = require('../database');

// creating user
// http://localhost:3000/api/signup/
router.post('/signup/', async (req, res, next)=>{ // req and res obj comes from nodejs
   
    const {username, email, pass ,user_id} = req.body; // data from input

    // checking duplicate user
    // db.query(`SELECT * FROM profile WHERE email=?`,[email], (re, match)=>{
    //     if(match.length>0){
    //        res.status(400).send("Duplicate user");
    //        res.end();
    //     }
    // });

    // checking duplicate user
    db.query('SELECT * FROM profile WHERE email = ?', [email], async (re, data)=>
    {

        // console.log(data);
        if (data.length > 0) {
          return res.status(400).json({ error: 'User already exists\n' });
        }
    
        // if there is no user existed with same email, create one
        const hash = await encrypt.hash(pass, 8);
    
        db.query("INSERT INTO profile(username, email, pass, role) values(?,?,?,?);", [username, email, hash,"user"],
        (err, result, fields)=>{ // err and result comes from database
            if(err) console.log(err);
            // if new added to db
            try {
                if(result.affectedRows) {
                    // console.log(result.affectedRows);
                    res.send(`User ${username} with mail ${email} has been added to the database\n`);
                    next();
                }
            } catch (error) {
                console.log(error);
            }
        });

    });
    
});

// getting all user

router.get('/userinfo',admin, (req, res)=>{
    db.query("SELECT * from profile", (err, result, fields)=>{
        if(err) console.log(err);
        else{
            res.send(result);
        }
    })
})
// updating user
router.put('/user/update/:id',admin, (req,res)=>{
    let sql = `SELECT * from profile WHERE user_id = ?`;
    db.query(sql, [req.params.id]
        , 
        async (err, oldData) =>{
            if(err) console.log(`logging from user update op`,err);

            let [{email,pass,role}] = oldData; //current data
            email = email || req.body.email, //update data
            pass = pass || req.body.pass, 
            role = role || req.body.role;
            const hash = await encrypt.hash(pass, 8);

            sql = `UPDATE profile SET email = ?, pass = ?, role = ? WHERE user_id = ?`;
            db.query(sql, [email,hash,role,req.params.id], 
                (err, feedback)=>{
                    if(err) console.log(`logging from update user`, err);
                    res.status(400).send(feedback);
                }
            )
        }
    )
})

// deleting user


// login 
// http://localhost:3000/api/signin/
router.post('/signin' , (req, res, next)=>{
    const {email, pass} = req.body; // extract pass from user input
    const sql = `SELECT email,pass,role FROM profile WHERE email =?`;

    db.query(sql, [email], (err, response)=>{
        if(err) console.log(err);
        else{
            const [{email, pass:hash, role}] = response; // extract pass from database

            // compare password
            encrypt.compare(pass, hash, async (err, success)=>{
                if(err){
                    console.log(pass+" "+hash);
                    console.log(err); res.status(400).send('password matching error');
                }
                else {
                    console.log(success);
                    console.log(pass+" "+hash);
                    const jwtData = {
                        email: email,
                        role: role
                    };
                    const token = await jwt.sign(jwtData, process.env.private_key); // (any string, private key)
                    res.json({messege: "login successful", token});
                    next();
                }
            })
        }
    })
})

module.exports = router;