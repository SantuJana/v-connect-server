import { config } from "dotenv";
config();
import { createServer } from "http";
import { SocketService } from "./service/socket.service";
import express from "express";
import routes from "./route";
import "./db/connection";

// Creating express app
const app = express();
// Creating http server
const server = createServer(app);
// Starting socket server
const socketService = new SocketService(server);
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/v-connect/api", routes);

// Importing port from environment file
const port = parseInt(process.env.PORT || "8082");
// Starting server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
