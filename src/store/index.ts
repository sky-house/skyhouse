import {RoomStore} from "./room";

export class RootStore {
  room: RoomStore
  constructor() {
    this.room = new RoomStore()
  }
}
