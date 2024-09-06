const jwt=require('jsonwebtoken');
const jwtkey="073ce5dd8943994b524b72379c0193a104f5bbb6976f9f7b37a62faa2ab4de4a";
const verify=(req,res,next)=>
{
    
    const authheader=req.headers['auth'];
    if(!authheader)
    {
        return res.status(401).json("auth header is required");
    }
    console.log({"my headers":authheader});
    const token=authheader.split(" ")[1];
    try
    {
        const decode=jwt.verify(token,jwtkey);
        //console.log({"decoded token":decode});
        next();
    }
    catch(err)
    {
        return res.status(401).json("invalid token");
    }
   
    
   
}
module.exports=verify;