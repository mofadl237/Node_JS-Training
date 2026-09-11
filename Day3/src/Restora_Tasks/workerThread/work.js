import { parentPort } from "node:worker_threads";

const result =[];

parentPort?.on('message',(orders)=>{
  calcOrders(orders,result);
  parentPort?.postMessage(result)
})