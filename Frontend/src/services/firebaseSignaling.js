import {db, ref, set, onValue, off, authenticate } from "./firebase.js";

class FirebaseSignaling {
    constructor(roomId, userId) {
      this.roomId = roomId;
      this.userId = userId;
      this.peersRef = ref(db, `rooms/${roomId}/peers`);
      this.signalsRef = ref(db, `rooms/${roomId}/signals`);
      this.authenticated = false;
    }
  
    async initialize() {
      try {
        await authenticate();
        this.authenticated = true;
      } catch (error) {
        console.error("Authentication failed:", error);
        throw error;
      }
    }
  
    async joinRoom() {
      if (!this.authenticated) {
        await this.initialize();
      }
      return set(ref(db, `rooms/${this.roomId}/peers/${this.userId}`), {
        joined: true,
        timestamp: Date.now()
      });
    }

  leaveRoom() {
    return set(ref(db, `rooms/${this.roomId}/peers/${this.userId}`), null);
  }

  onPeerJoined(callback) {
    this.peerListener = onValue(this.peersRef, (snapshot) => {
      const peers = snapshot.val() || {};
      Object.keys(peers).forEach(peerId => {
        if (peerId !== this.userId) {
          callback(peerId);
        }
      });
    });
  }

  onSignalReceived(callback) {
    this.signalListener = onValue(this.signalsRef, (snapshot) => {
      const signals = snapshot.val() || {};
      Object.keys(signals).forEach(signalId => {
        const signal = signals[signalId];
        if (signal.to === this.userId) {
          callback(signal.data);
          set(ref(db, `rooms/${this.roomId}/signals/${signalId}`), null);
        }
      });
    });
  }

  sendSignal(to, data) {
    const signalId = Date.now().toString();
    return set(ref(db, `rooms/${this.roomId}/signals/${signalId}`), {
      from: this.userId,
      to,
      data,
      timestamp: Date.now()
    });
  }

  cleanup() {
    if (this.peerListener) off(this.peerListener);
    if (this.signalListener) off(this.signalListener);
  }
}

export default FirebaseSignaling;