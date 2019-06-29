'use strict'
//Authentication prototipe, may change for improved functionality
const jwt = require('jsonwebtoken');

exports.isAuthenticated = function(req, res, next){
    //Request header with authorization key
    const bearerHeader = req.headers.authorization
    //Check if there is  a header
    if(typeof bearerHeader !== 'undefined'){
        jwt.verify(bearerHeader, process.env.JSON_PRIVATEKEY, (err, authData)=>{
            if(err){
                console.log(err);
                res.sendStatus(403);
            } else{
                console.log(authData);
                console.log(req.url);
                if(authData.Role.includes(req.url)){
                    next();
                }
                else{
                    res.sendStatus(403);
                }
            }
        });
    }
    else{
        res.sendStatus(403);
    }
}