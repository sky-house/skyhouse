import React, { useEffect, useRef, useState } from 'react'
import Peer, { MeshRoom } from 'skyway-js'
import { RouteComponentProps } from 'react-router-dom'
import { Audio } from '../atoms/Audio'

interface MediaStreamWithPeerId extends MediaStream {
  peerId: string
}

interface Props extends RouteComponentProps<{ roomId: string }> {}

const Test: React.FC<Props> = (props) => {
  const { roomId } = props.match.params
  const [audioMedias, setAudioMedias] = useState<MediaStreamWithPeerId[]>([])
  const [chatLogs, setChatLogs] = useState<string[]>([])
  const [chatInput, setChatInput] = useState('')
  const roomRef = useRef<MeshRoom>(null)
  useEffect(() => {
    const peer = new Peer({
      key: process.env.REACT_APP_SKYWAY_API_KEY,
      // debug: 3,
    })
    peer.on('open', () => {
      const room = peer.joinRoom(roomId)
      // @ts-ignore
      roomRef.current = room
      room.on('open', () => {
        console.log('open', room)
        room.getLog()
      })
      room.on('log', (logs) => {
        const chats = logs
          .map((log) => JSON.parse(log))
          .filter((log) => log.messageType === 'ROOM_DATA')
          .map((log) => log.message.data)
        setChatLogs([...chatLogs, ...chats])
      })
      room.on('data', ({ src, data }) => {
        console.log('data', data)
        setChatLogs((prev) => [...prev, data])
      })
      room.on('stream', (stream) => {
        setAudioMedias([...audioMedias, stream])
      })
      // room.on('peerJoin', peerId => {})
      room.on('peerLeave', (peerId) => {
        setAudioMedias(audioMedias.filter((media) => media.peerId !== peerId))
      })
    })
  }, [roomId])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('send chat')
    if (roomRef.current === null) {
      return
    }
    // @ts-ignore
    roomRef.current.send(chatInput)
    setChatLogs([...chatLogs, chatInput])
    setChatInput('')
  }

  return (
    <div>
      <div>Room ID: {roomId}</div>
      <div>
        {chatLogs.map((chat) => (
          <li>{chat}</li>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setChatInput(e.target.value)}
          value={chatInput}
        />
      </form>
      {audioMedias.map((media) => (
        <div key={media.peerId}>
          <Audio stream={media} />
          <div>{media.peerId}</div>
        </div>
      ))}
    </div>
  )
}

export default Test
