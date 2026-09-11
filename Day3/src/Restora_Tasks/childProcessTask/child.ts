import { calcOrders } from "./utils"
import { IOrders, IResultOrders } from './data';

const results:IResultOrders[]=[];

process.on('message',(msg:IOrders[])=>{
    calcOrders(msg,results);
    process.send!(`${JSON.stringify(results,null , 2)}`)
});

