import * as WebSocket from 'ws';

const webSocketHandler = (ws: WebSocket) => {
    console.log("New client connected (WebSocket)");
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
  
    //send immediatly a feedback to the incoming connection    
    ws.send('Connected to the websocket server!');
  };

  export default webSocketHandler;