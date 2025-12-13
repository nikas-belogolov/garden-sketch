import { Server } from "http";

export const createSocketServer = (httpServer: Server) => {
    const io = new Server(httpServer);
    
    io.on("connection", (socket) => {
        console.log("a user connected");
    });
}