

const jwt= require('jsonwebtoken');

const auth =(req,res,next)=>{
    const token =req.headers.authorization
    let decoded =jwt.decode(token,"tanuj");
console.log(decoded)
    if(decoded){
        req.body.userID=decoded.userID
        req.body.username=decoded.username

        next();

    }
    else{
        res.send({"{msg":"login again"});
    }
}

module.exports={auth}