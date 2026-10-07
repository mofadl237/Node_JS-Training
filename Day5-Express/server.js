import express from 'express'


const app = express();

// 1- middleware
app.use(express.json());

const requireAdmin = (req,res,next)=>{
    const isAdmin =false ;
    if(!isAdmin)
        res.status(403).json({success:false, message:"Forbidden Not Admin"});
    next();
}

app.get('/',[requireAdmin],(req,res,next)=>{
    res.set("Content-Type","application/json", "X-Powered-By","Express" , "X-Author","MoFadl" , "X-Server","Express Server" , "X-Custom-Header","Training Express" , "X-Request-ID","1234567890");
    res.status(200).json({success:true,message:"Hello Hello"});
    
})

app.listen(3000,()=>{
    console.log("Server Listing 3000")
})