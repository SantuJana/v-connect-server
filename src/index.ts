import { config } from "dotenv";
config();
import { createServer } from "http";
import cors from "cors";
import { SocketService } from "./service/socket.service";
import express from "express";
import routes from "./route";
import "./db/connection";
import path from "path";
import handleError from "./middleware/handleError";

// Creating express app
const app = express();
// Creating http server
const server = createServer(app);
// Starting socket server
const socketService = new SocketService(server);
// middlewares
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
// public folder setup
app.use(express.static(path.join(__dirname, "../public")));

// Importing port from environment file
const port = parseInt(process.env.PORT || "8082");
const host = process.env.HOST || "http://localhost";

// local variables setup
app.locals.baseUrl = `${host}:${port}`;

// Routes
app.use("/v-connect/api", routes);
app.use(handleError);
// Starting server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
