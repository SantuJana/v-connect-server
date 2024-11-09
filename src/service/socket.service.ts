import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
  server: HttpServer;
  io: Server;
  socketEmailMap: Map<string, string> = new Map();
  emailSocketMap: Map<string, string> = new Map();

  constructor(httpServer: HttpServer) {
    this.server = httpServer;
    this.io = new Server(this.server, { cors: { origin: "*" } });
    this.init();
  }

  init() {
    this.io.on("connect", (socket) => {
      console.log("A user is connected with socket id: ", socket.id);
      socket.on("room:join", (data) => {
        const { email, room } = data;
        this.socketEmailMap.set(socket.id, email);
        this.emailSocketMap.set(email, socket.id);
        socket.join(room);
        this.io.to(room).emit("user:join", { email, id: socket.id });
        this.io.to(socket.id).emit("room:join", data);
      });
      socket.on("user:call", (data) => {
        const { to, offer } = data;
        this.io.to(to).emit("incoming:call", { from: socket.id, offer });
      });
      socket.on("call:accepted", (data) => {
        const { to, ans } = data;
        this.io.to(to).emit("call:accepted", { from: socket.id, ans });
      });
      socket.on("peer:nego:needed", (data) => {
        const { to, offer } = data;
        this.io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
      socket.on("peer:nego:done", (data) => {
        const { to, ans } = data;
        this.io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
    });
  }
}

export { SocketService };
