"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/backend', user_route_1.default);
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
