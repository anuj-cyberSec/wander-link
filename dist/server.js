"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
const port = 5000;
const websocket_1 = require("./websocket");
const server = http_1.default.createServer(app);
(0, websocket_1.server)(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// allow 5mb file uploads
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
(0, db_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/backend/users', user_route_1.default);
app.use('/backend/auth', auth_route_1.default);
server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
