import { WS_BASE_URL } from '../constants/config';
import { RealtimeEvent } from '../types';

class WebSocketService {
  private socket: WebSocket | null = null;

  connect(onEvent: (event: RealtimeEvent) => void) {
    if (this.socket) return;

    this.socket = new WebSocket(WS_BASE_URL);
    this.socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data) as RealtimeEvent;
        onEvent(data);
      } catch {
        // ignore malformed events
      }
    };
    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(() => this.connect(onEvent), 3000);
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const websocketService = new WebSocketService();
