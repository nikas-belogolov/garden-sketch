import { createContext } from "react";
import { WebsocketProvider } from 'y-websocket'

type webSocketContextType = {

}

const webSocketContext = createContext<webSocketContextType>({})