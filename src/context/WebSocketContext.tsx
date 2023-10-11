import React, { createContext, FC, useEffect } from 'react';
import WebSocketClient from './WebSocketClient';

interface WebSocketContextType {
  ws: WebSocketClient | null;
}
interface Props {
  children: React.ReactNode;
}
const WebSocketContext = createContext<WebSocketContextType>({ ws: null });

const WebSocketProvider: FC<Props> = ({ children }) => {
  const ws = new WebSocketClient();

  useEffect(() => {
    ws.connect();

    return () => {
      ws.close();
    };
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
