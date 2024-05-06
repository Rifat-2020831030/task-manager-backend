const express = require('express'),
    router = express.Router(),
    admin = require('../authMiddleware/admin'),
    user = require('../authMiddleware/user');

const encrypt = require("bcryptjs"),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv');
    dotenv.config();

const db = require('../database');
const saltRounds = 8;
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
    db.query('SELECT * FROM profile WHERE email = ?', [email], async (err, data)=>
    {
        if(err) console.log(err);
        // console.log(data);
        if (data.length > 0) {
          return res.status(400).json({ error: 'User already exists\n' });
        }
        
        const {role} = req.headers;
    
        // if there is no user existed with same email, create one
        encrypt.hash(pass, saltRounds, function(err, hash) {
            // Store hash in password DB.
            db.query("INSERT INTO profile(username, email, pass, role) values(?,?,?,?);", [username, email, hash,role],
            (err, result, fields)=>{ // err and result comes from database
                if(err) console.log(err);
                // if new added to db
                try {
                    if(result.affectedRows) {
                        // console.log(result.affectedRows);
                        const jwtData = {
                            email: email,
                            role: role
                        };
                        const token = jwt.sign(jwtData, process.env.private_key); // (any string, private key)
                        res.setHeader('authorization', token);
                        res.json({
                            msg: `User ${username} with mail ${email} has been added to the database\n`,
                            token: token
                        });
                        next();
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        });
        // const hash = await encrypt.hash(pass, 8);
    

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
            const hash = await encrypt.hash(pass, saltRounds);


            sql = `UPDATE profile SET email = ?, pass = ?, role = ? WHERE user_id = ?`;
            db.query(sql, [email,hash,role,req.params.id], 
                (err, feedback)=>{
                    if(err) console.log(`logging from update user`, err);
                    else if(feedback.affectedRows) res.status(400).send(feedback);
                    else res.json({err: "There is an error in update operation"})
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

    db.query(sql, [email], async (err, response)=>{
        
        if(err) console.log(err);
        // if email has a entry in db match password
        else if(response.length > 0){
            console.log(response);
            const [{ pass:hash, role}] = response; // extract pass from database

            // compare password
            const verify = await encrypt.compare(pass, hash);

            console.log(verify);
            if(verify) {
                const jwtData = {
                    email: email,
                    role: role
                };
                const token = jwt.sign(jwtData, process.env.private_key); // (any string, private key)
                res.setHeader('authorization', token);
                res.json({messege: "login successful", token});
                next();
            }else{
                res.json({error: "Enter a valid Password!"})
            }
        }
        else res.status(200).json({error:"NO user found!"})
    })
})

module.exports = router;