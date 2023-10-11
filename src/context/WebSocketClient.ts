export class WebSocketClient {
  private ws: WebSocket | null = null;
  private wsStatus: boolean = false; 
  private sessionRef:string = ''; 
  private loadingCallback: Function = () => {}; 
  private valueCallback: Function = () => {}


  connect() {
    const url:string = '' //Add websocket url here
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.wsStatus = true; 
    };

    this.ws.onmessage = (event) => {
      const response:StatusResponse | Message = JSON.parse(event.data);
      if(response.mode === 'sessionResponse'){
        this.loadingCallback(response.success);
      } else if(response.mode === 'message'){
        this.valueCallback(response.message)
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.reason);
      this.wsStatus = false; 
    };
  }
  public getWsStatus():boolean{
    return this.wsStatus;
  }
  public setValueCallback(callback:Function){
    this.valueCallback = callback; 
  }
  public connectToSession(loadingCallback:Function, sessionRef:string) {
    this.sessionRef = sessionRef; 
    this.loadingCallback = loadingCallback; 

    const msg = {
      "mode":"join", 
      "sessionRef": sessionRef
    }

    this.send(JSON.stringify(msg));
  }


  public send(data: string) {
    if (this.ws) {
      this.ws.send(data);
    }
  }
  public sendMessage(text:string) {
    const msg = {
      "mode":"message", 
      "sessionRef": this.sessionRef, 
      "message": text, 
    }

    this.send(JSON.stringify(msg));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketClient;

type StatusResponse = {
  mode:"statusResponse" | "sessionResponse", 
  sessionRef: string, 
  success: boolean, 
}
type Message = {
  mode: 'message',
  sessionRef: string,
  message: string, 
}