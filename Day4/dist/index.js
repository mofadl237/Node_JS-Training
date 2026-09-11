import { createServer } from 'node:http';
import dotenv from 'dotenv';
dotenv.config();
const hostname = process.env.HOST_NAME || '127.0.0.1';
const port = Number(process.env.PORT) || 3000;
console.log(hostname, port);
const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=index.js.map