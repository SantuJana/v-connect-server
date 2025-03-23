"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_service_1 = require("./service/socket.service");
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route"));
require("./db/connection");
const path_1 = __importDefault(require("path"));
// Creating express app
const app = (0, express_1.default)();
// Creating http server
const server = (0, http_1.createServer)(app);
// Starting socket server
const socketService = new socket_service_1.SocketService(server);
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// public folder setup
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Importing port from environment file
const port = parseInt(process.env.PORT || "8082");
const host = (process.env.HOST || "http://localhost");
// local variables setup
app.locals.baseUrl = `${host}:${port}`;
// Routes
app.use("/v-connect/api", route_1.default);
// Starting server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
