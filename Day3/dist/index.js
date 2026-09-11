// import fs from "fs";
// import { type IUser } from "./Interfaces/index";
export {};
// // const zlib = require("zlib");
// // const { Transform } = require("stream");
// // // const myBuffer = Buffer.from("Hello World");
// // // // console.log(myBuffer);
// // // const myBuffer2 = myBuffer.toString();
// // // console.log(myBuffer2);
// // // // console.log(myBuffer2.toString("utf8"));
// // // // console.log(myBuffer[3]?.toString());
// // // // console.log(myBuffer.toString("hex"));
// // const readStream = fs.createReadStream("input.txt");
// // // const writeStream = fs.createWriteStream('input.txt');
// // // writeStream.write("Hello");
// // // writeStream.end("\nEnd");
// // const upperCaseTransform = new Transform({
// //   transform(chunk: any, encoding: any, callback: any) {
// //     const upper = chunk.toString().toUpperCase();
// //     this.push(upper);
// //     callback();
// //   },
// // });
// // const filterTransForm = new Transform({
// //   transform(chunk, encoding, callback) {
// //       const text = chunk.toString();
// //       const lines = text.split("\n");
// //    for (const line of lines) {
// //             if (line.includes("Error")) {
// //                 this.push(line + "\n");
// //             }
// //         }
// //     callback();
// //   },
// // });
// // readStream.pipe(upperCaseTransform).pipe(fs.createWriteStream("upper.txt"));
// // readStream.pipe(filterTransForm).pipe(fs.createWriteStream("error.txt"));
// const getData = ():Promise<IUser[]> => {
//   return new Promise((res, rej) => {
//     const readStream = fs.createReadStream("db.json");
//     let data = "";
//     let users:IUser[] =[];
//     readStream.on("data", (chunk) => {
//       data += chunk;
//     });
//     readStream.on("end", () => {
//       data = data.toString();
//       users =JSON.parse( data);
//       res(users);
//     });
//     readStream.on('error',(err)=>{
//         rej(err)
//     })
//   });
// };
// const writeData =  (data:IUser[]):Promise<void>=>{
//    return new Promise((res,rej)=>{
//         const writeStream = fs.createWriteStream("db.json");
//        writeStream.write(JSON.stringify(data, null, 2));
//         writeStream.on('finish',()=>{
//             res();
//         });
//          writeStream.on("error", (err) => {
//       rej(err);
//     });
//     writeStream.end();
//     })
// }
// const addUser = async (user: IUser) => {
//   let users = await getData();
//   users.push(user)
//  await writeData(users)
//   console.log("Users ===> \n",users );
// };
// // addUser({ username: "Ali", age: 30, email: "M@gmail.com" });
// import {EventEmitter} from 'events'
// import * as fs from 'fs';
// const myEmitter = new EventEmitter();
// // const readStream= fs.createReadStream('restora.json');
// // const writeStream= fs.createWriteStream('restora.json');
// let order="#101";
// const addOrder =(order:any)=>{
// console.log(order)
// }
// const analysisSales = (order:any)=>{
// console.log("Analysis : ", order)
// }
// const loggerOrder =(order:any)=>{
// console.log("Logger : ",order)
// }
// const cancelOrder = (order:any)=>{
// console.log("CANCEL : ",order)
// }
// myEmitter.on("createdOrder",addOrder)
// myEmitter.on("createdOrder",analysisSales)
// myEmitter.on("createdOrder",loggerOrder)
// myEmitter.once("cancelOrder",cancelOrder)
// myEmitter.emit('createdOrder',order)
// myEmitter.emit('cancelOrder',order)
// myEmitter.emit('cancelOrder',order)
// myEmitter.emit('cancelOrder',order)
// myEmitter.emit('cancelOrder',order)
//# sourceMappingURL=index.js.map