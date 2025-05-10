import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Socket from "../model/socket.model";
import jwt, { Secret } from "jsonwebtoken";
import User from "../model/user.model";
import mongoose from "mongoose";

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
      // new
      socket.on("socketConnect", (data) => {
        const { _id } = data;
        if (_id) {
          this.mapUserSocket(_id, socket.id);
        }
      });

      socket.on("video:call", async (data) => {
        const {from, to} = data;
        const socketId = await this.getUserSocket(to);
        if (!socketId) return;
        const user = await this.getUser(from);
        socket.to(socketId).emit("video:call", {guest: socket.id, name: user?.name, image: user?.image, self: socketId, _id: user?._id});
      })

      socket.on("video:call:decline", async (data) => {
        const {from, to} = data;
        const socketId = await this.getUserSocket(to);
        if (!socketId) return;
        socket.to(socketId).emit("video:call:decline", {from: socket.id, to:socketId});
      })

      socket.on("video:call:cancel", async (data) => {
        const {from, to} = data;
        const socketId = await this.getUserSocket(to);
        if (!socketId) return;
        socket.to(socketId).emit("video:call:cancel", {from: socket.id, to:socketId});
      })

      socket.on("video:call:accept", async (data) => {
        const {from, to} = data;
        const socketId = await this.getUserSocket(to);
        if (!socketId) return;
        socket.to(socketId).emit("video:call:accept", {guest: socket.id, self: socketId});
      })

      // old
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

      socket.on("call:stream:request", (data) => {
        const { to } = data;
        console.log("$$$$$", to)
        socket.to(to).emit("call:stream:request", { from: socket.id });
      });

      socket.on("peer:nego:needed", (data) => {
        const { to, offer } = data;
        this.io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });

      socket.on("peer:nego:done", (data) => {
        const { to, ans } = data;
        this.io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
      
      socket.on("call:end", (data) => {
        const { to } = data;
        this.io.to(to).emit("call:end", { from: socket.id });
      });
    });
  }

  async mapUserSocket(_id: string, socketId: string) {
    try {
      let socket = await Socket.findOne({
        userId: new mongoose.Types.ObjectId(_id),
      });

      if (socket) {
        socket.socketId = socketId;
        socket.save();
      } else {
        Socket.create({
          userId: new mongoose.Types.ObjectId(_id),
          socketId: socketId,
        });
      }
    } catch (error: any) {
      console.log("Error: ", error.message)
    }
  }

  async getUserSocket(_id: string){
    try {
      const socket = await Socket.findOne({
        userId: new mongoose.Types.ObjectId(_id)
      })
      return socket?.socketId;
    } catch (error: any) {
      console.log("Error: ", error.message)
    }
  }

  async getUser(_id: string){
    try {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(_id)
      })
      
      return user;
    } catch (error) {
      
    }
  }
}

export { SocketService };
