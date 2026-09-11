import { parentPort } from 'worker_threads';
parentPort?.on('message', (msg) => {
    console.log("From Parent", msg);
});
//# sourceMappingURL=work.js.map