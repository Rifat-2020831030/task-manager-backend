const jwt = require('jsonwebtoken');


const user = async (req, res, next)=>{
    try {
        const {"x-auth-token": userToken} = req.headers;

        const verify = jwt.verify(userToken, "secret_key"); // if user exist return email else return null

        console.log(verify, userToken, process.env.private_key);

        if(!verify) return res.status(200).send('Authorization Failed for user');
        else {
            if(verify.role == 'admin' || verify.role == 'user'){
            console.log('verified : ', verify);
            next();
            // return res.send("congratulation!");
            }
            else {
                console.log(verify);
                return res.status(200).send('Not verified user');
            }
         }
        // req.token = process.env.private_key;

    } catch (error) {
        console.log('Logging from user.js :', error);
    }
}

module.exports = user;