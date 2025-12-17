import { createServer } from "http";
import next from "next";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "@y/websocket-server/utils";
import { auth } from "./lib/auth/auth";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const wss = new WebSocketServer({ noServer: true })

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  })

  httpServer.on("upgrade", async (request, socket, head) => {

    // Check if the websocket upgrade request is coming from yjs
    if (request.headers["sec-websocket-protocol"] === "yjs") {

      // Check authentication
      const session = await auth.api.getSession({
        headers: new Headers(request.headers as HeadersInit)
      })

      if (!session) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy()
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log("client connected!");
        wss.emit("connection", ws, request)
      })
    }
  })

  wss.on("connection", setupWSConnection)

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
        }`,
      );
    });

});