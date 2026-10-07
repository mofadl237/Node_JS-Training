// // Service Layer 
//  function getUsersService() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (users.length > 0) {
//         resolve(users);
//       } else {
//         reject(new Error("Users not found"));
//       }
//     }, 5000);
//   });
// }

// // Controller Layer
// async function getUsersController(req, res) {
//   try {
//     const users = await getUsersService();

//     res.writeHead(200, {
//       "content-type": "application/json"
//     });

//     res.end(JSON.stringify(users));

//   } catch (error:any) {

//     res.writeHead(404, {
//       "content-type": "application/json"
//     });

//     res.end(JSON.stringify({
//       message: error.message
//     }));
//   }
// }



// import http from 'http'
// import { users } from './DB/index.js'
// const server =  http.createServer((req,res)=>{

//   if(req.url === '/users' && req.method === 'GET'){
//     return   getUsersController(req,res);
//   }
//   // if(req.url === '/customers' && req.method === 'GET'){
//   //   return   getUsersController(req,res);
//   // }
//   // if(req.url === '/manager' && req.method === 'GET'){
//   //   return   getUsersController(req,res);
//   // }

  
// // Post Data
// if(req.method  == 'POST'){
//   let body = ''; // Validation
//   req.on('data' , (chunk)=>{
//     body += chunk.toString();
//   })
//   req.on('end' , ()=>{
//     console.log("Send Data Body =>  " , body)
//     res.end("End Receive Data")
//   })
// }


//   res.writeHead(200,{"content-type":"text/plain"});
//   res.end("Hello Every One jjj")
// })







// server.listen(8080,()=>{
//   console.log("Server Running http://localhost:8080")
// })




// 

import http from 'http'
 import { users } from './DB/index.js'
const server = http.createServer((req,res)=>{

})

server.listen(8080,()=>{
  console.log("Server Running http://localhost:8080")
})