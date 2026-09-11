import { Worker } from "node:worker_threads";
import { orders } from "./data.js";
const worker = new Worker(new URL("./work.ts", import.meta.url), {
    execArgv: ["--import", "tsx"],
});
worker.postMessage(orders);
worker.on("message", (message) => {
    console.log("Message from Worker:", message);
});
worker.on("error", (error) => {
    console.error("Worker Error:", error);
});
worker.on("exit", (code) => {
    console.log("Worker exited with code:", code);
});
//# sourceMappingURL=parent.js.map