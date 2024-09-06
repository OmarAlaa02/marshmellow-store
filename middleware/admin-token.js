const jwt=require('jsonwebtoken');
const jwtkey="1426fece8ab79ee5ef81a92206cc8de8de6b93699b893cb6a02072329ebeaa7a";
const verify=(req,res,next)=>
{
    
    const authheader=req.headers['authentication'];
    if(!authheader)
    {
        return res.status(401).json("token is required");
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