import { calcOrders } from "./utils";
const results = [];
process.on('message', (msg) => {
    calcOrders(msg, results);
    process.send(`${JSON.stringify(results, null, 2)}`);
});
//# sourceMappingURL=child.js.map