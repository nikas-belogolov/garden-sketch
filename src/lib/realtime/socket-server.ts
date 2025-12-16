import { type Server } from "http";

import { WebSocketServer } from "ws";

import { setupWSConnection } from "@y/websocket-server/utils";

const wss = new WebSocketServer({ noServer: true })

export const createSocketServer = (httpServer: Server) => {

    httpServer.on("upgrade", (request, socket, head) => {

        // Check if the websocket upgrade request is coming from yjs
        if (request.headers["sec-websocket-protocol"] === "yjs") {

            // TODO: Check bearer token validity
            

            wss.handleUpgrade(request, socket, head, (ws) => {
                console.log("client connected!");
                wss.emit("connection", ws, request)
            })
        }
    })

    wss.on("connection", setupWSConnection)
}