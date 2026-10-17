import express from "express";
import dotenv from "dotenv";
import { Client ,Pool} from "pg";
import { getUserServices } from "./services/users.services.js";
import { routerUsers } from "./routers/users.routes.js";

dotenv.config();

const app = express();

// 1- MiddleWares
app.use(express.json());

// 2-Connect DB


const client = new Client({
  host: process.env.HOST,
  port: parseInt(process.env.PORT||"5432") ,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// const pool =  new Pool({
// host: process.env.HOST,
//   port: parseInt(process.env.PORT||"5432") ,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   max:10
// })

// async function ConnectDB() {
//   await client.connect();
//   console.log("Connected to PostgreSQL");
//   const results = await client.query("SELECT * FROM users");
//   console.log(results.rows);
//   await client.end();
// }
// ConnectDB();



// Connection pooling
// app.get('/',async(req,res:any)=>{
//   const users = await getUserServices();
//   res.status(200).json({success:true,data:getUserServices })
// })


// routing

app.use('/api/users',routerUsers)

app.listen('3000',()=>{
  console.log("Server Listing 3000 ....");
})