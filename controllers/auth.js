exports.authorize=(req,res,next)=>{
    console.log(req.session.isLoggedIn); 
    if(!req.session.isLoggedIn)
        return res.status(401).redirect('/signin');
    next();
}

exports.authorizeAdmin=(req,res,next)=>{
    console.log(req.session.isAdmin);
    if(!req.session.isAdmin)
        return res.redirect('/admin/signin');
    next();
}