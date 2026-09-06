// import { setTimeout } from "node:timers/promises"

// const http = require('http')
// const server=http.createServer((req,res)=>{
//     setTimeout( ()=>{
//         console.log("Hello Set Time Out...")
//     },2000)
// })


// const dotenv =require('dotenv');
// dotenv.config();
// console.log("Proccess PID :",process.pid)
// console.log("Proccess Platform :",process.platform)
// console.log("Proccess Version :",process.version)
// console.log("My Name :",process.env.MY_NAME)



// function connectDB(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const isConnected = true; 

//     if (isConnected) {
//       resolve("DB connected successfully");
//     } else {
//       reject("DB connection failed");
//     }
//   });
// }

// async function start() {
//   try {
//     const result = await connectDB();
//     console.log(result);
//   } catch (err) {
//     console.error("Error:", err);
//     process.exit(1);
//   }
// }

// start();

// setInterval(()=>{
//     console.log("Server is running... Press Ctrl+C to stop")
// },1000)

// process.on("SIGINT", ()=>{
//     console.log(`GraseFul ShutDown Signal `);
//     process.exit(0)
// })

// //1- write in dataBase 
// const writeDB = () => {
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       console.log("Write On DB");
//       resolve();
//     }, 3000);
//   });
// };

// const handleGraceFul = async () => {
//   console.log("GraseFul ShutDown");
//   await writeDB();
//   console.log("Handle ShutDown");
//   process.exit(0);
// };

// process.on("SIGINT", handleGraceFul);

// console.log("Server is running... Press Ctrl+C to stop");
// setInterval(() => {}, 1000); 


console.log("HIII")