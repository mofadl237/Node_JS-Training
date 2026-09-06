"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = express();
dotenv.config();
app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.send("Get Api Data...");
});
app.listen(process.env.PORT, () => {
    console.log("Listen ... ", process.env.PORT);
});
//# sourceMappingURL=index.js.map