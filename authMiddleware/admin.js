const jwt = require('jsonwebtoken');


const admin = async (req, res, next)=>{
    try {
        const {"authorization": userToken} = req.headers;

        if(!userToken) return res.status(401).json({err:"NO auth token found"});

        const verify = jwt.verify(userToken, process.env.private_key); // if user exist return email else return null

        if(!verify) {
        return res.status(200).send('Authorization Failed for admin');
        }
        else if(verify.role == 'user') return res.status(200).send('User access denied!');
        else if(verify.role == 'admin') {
            console.log('verified : ', verify);
            next();
            // return res.send("congratulation!");
        }
        else return res.status(200).send('Not Authorized as admin');
        // req.token = process.env.private_key;

    } catch (error) {
        console.log('Logging from admin.js :', error);
    }
}

module.exports = admin;