import { Worker } from "node:worker_threads";
const worker = new Worker(new URL("./work.js", import.meta.url));
worker.postMessage('Hello Worker');
//# sourceMappingURL=parent.js.map