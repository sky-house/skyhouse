import Peer from 'skyway-js'

export class RoomStore {
  peer: Peer | null
  test: string

  constructor() {
    this.peer = null
    this.test = 'aaaaaaaaa'
  }

  initPeer() {
    this.peer = new new Peer({key: process.env.REACT_APP_SKYWAY_API_KEY})
  }
  async joinRoom(roomId: string) {
    if (this.peer === null) {
      console.error('peer is null')
      return
    }
    if (!this.peer.open) {
      return
    }
    const localStream = await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .catch(console.error);
    const room = this.peer.joinRoom(roomId, {
      stream: localStream,
    });
  }
}
