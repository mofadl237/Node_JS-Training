
export const requireAdmin = (req:any,res:any,next:any)=>{
    const isAdmin =false ;
    if(!isAdmin)
        res.status(403).json({success:false, message:"Forbidden Not Admin"});
    next();
}