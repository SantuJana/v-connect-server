import { Server } from "socket.io";
import { createServer } from "http";

const server = createServer();

const io = new Server(server, { cors: { origin: "*" } });

const socketEmailMap = new Map();
const emailSocketMap = new Map();

io.on("connect", (socket) => {
  console.log("A user is connected with socket id: ", socket.id);
  socket.on("room:join", (data) => {
    console.log("////// user joined /////");
    const { email, room } = data;
    socketEmailMap.set(socket.id, email);
    emailSocketMap.set(email, socket.id);
    socket.join(room);
    io.to(room).emit("user:join", { email, id: socket.id });
    io.to(socket.id).emit("room:join", data);
  });
  socket.on("user:call", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });
  socket.on("call:accepted", (data) => {
    const { to, ans } = data;
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  socket.on("peer:nego:needed", (data) => {
    const { to, offer } = data;
    console.log("/////// nego needed //////", data)
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });
  socket.on("peer:nego:done", (data) => {
    const { to, ans } = data;
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

server.listen(8000, "0.0.0.0", () => {
  console.log("Server is running on http://192.168.0.200:8000");
});
