"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const socket_model_1 = __importDefault(require("../model/socket.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class SocketService {
    constructor(httpServer) {
        this.socketEmailMap = new Map();
        this.emailSocketMap = new Map();
        this.server = httpServer;
        this.io = new socket_io_1.Server(this.server, { cors: { origin: "*" } });
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
            socket.on("video:call", (data) => __awaiter(this, void 0, void 0, function* () {
                const { from, to } = data;
                const socketId = yield this.getUserSocket(to);
                if (!socketId)
                    return;
                const user = yield this.getUser(from);
                socket.to(socketId).emit("video:call", { guest: socket.id, name: user === null || user === void 0 ? void 0 : user.name, image: user === null || user === void 0 ? void 0 : user.image, self: socketId, _id: user === null || user === void 0 ? void 0 : user._id });
            }));
            socket.on("video:call:decline", (data) => __awaiter(this, void 0, void 0, function* () {
                const { from, to } = data;
                const socketId = yield this.getUserSocket(to);
                if (!socketId)
                    return;
                socket.to(socketId).emit("video:call:decline", { from: socket.id, to: socketId });
            }));
            socket.on("video:call:cancel", (data) => __awaiter(this, void 0, void 0, function* () {
                const { from, to } = data;
                const socketId = yield this.getUserSocket(to);
                if (!socketId)
                    return;
                socket.to(socketId).emit("video:call:cancel", { from: socket.id, to: socketId });
            }));
            socket.on("video:call:accept", (data) => __awaiter(this, void 0, void 0, function* () {
                const { from, to } = data;
                const socketId = yield this.getUserSocket(to);
                if (!socketId)
                    return;
                socket.to(socketId).emit("video:call:accept", { guest: socket.id, self: socketId });
            }));
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
                console.log("$$$$$", to);
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
    mapUserSocket(_id, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let socket = yield socket_model_1.default.findOne({
                    userId: new mongoose_1.default.Types.ObjectId(_id),
                });
                if (socket) {
                    socket.socketId = socketId;
                    socket.save();
                }
                else {
                    socket_model_1.default.create({
                        userId: new mongoose_1.default.Types.ObjectId(_id),
                        socketId: socketId,
                    });
                }
            }
            catch (error) {
                console.log("Error: ", error.message);
            }
        });
    }
    getUserSocket(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const socket = yield socket_model_1.default.findOne({
                    userId: new mongoose_1.default.Types.ObjectId(_id)
                });
                return socket === null || socket === void 0 ? void 0 : socket.socketId;
            }
            catch (error) {
                console.log("Error: ", error.message);
            }
        });
    }
    getUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    _id: new mongoose_1.default.Types.ObjectId(_id)
                });
                return user;
            }
            catch (error) {
            }
        });
    }
}
exports.SocketService = SocketService;
