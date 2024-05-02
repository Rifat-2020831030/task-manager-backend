const db = require('../database');

module.exports.insertUser = async () => {
    db.query("SELECT * from profile", (err, result, fields)=>{
        if(err) console.log(err);
        else{
            return result;
        }
    })
};