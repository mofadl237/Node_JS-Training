//read orders 
// send order to calculate in child 
// child send total orders
import { fork } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { orders } from "./data";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const childPath = path.join(__dirname, "child.ts");
const child = fork(childPath, [], {
    execArgv: ["--import", "tsx"],
});
child.send(orders);
child.on('message', (msg) => {
    console.log("Results ==> ", msg);
});
//# sourceMappingURL=parent.js.map