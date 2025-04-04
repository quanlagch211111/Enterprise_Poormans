import { Peer } from 'peerjs';

class PeerService {
  constructor(userId) {
    this.peer = new Peer(userId, {
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" }
        ]
      }
    });
    this.listeners = {};
  }

  on(event, callback) {
    this.peer.on(event, callback);
    this.listeners[event] = callback;
  }

  off(event) {
    if (this.listeners[event]) {
      this.peer.off(event, this.listeners[event]);
      delete this.listeners[event];
    }
  }

  destroy() {
    Object.keys(this.listeners).forEach(event => this.off(event));
    this.peer.destroy();
  }
}

export default PeerService;