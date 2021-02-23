import React, { useEffect, useRef, useState } from 'react'
import Peer from 'skyway-js'
import { RouteComponentProps } from 'react-router-dom'

interface Props extends RouteComponentProps<{ roomId: string }> {}

const Test: React.FC<Props> = (props) => {
  const { roomId } = props.match.params
  const [audioMedias, setAudioMedias] = useState<MediaStream[]>([])
  useEffect(() => {
    const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_API_KEY })
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((localStream) => {
        const room = peer.joinRoom(roomId, { stream: localStream })
        room.on('stream', (stream) => {
          setAudioMedias([...audioMedias, stream])
        })
      })
      .catch(console.error)
  }, [roomId, audioMedias])

  return (
    <div>
      <div>{roomId}</div>
      {audioMedias.map((media) => (
        <div key={(media as any).peerId}>
          <Audio stream={media} />
          <div>{(media as any).peerId}</div>
        </div>
      ))}
    </div>
  )
}

const Audio: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const $audio = audioRef.current
    if ($audio === null) {
      return
    }
    if ($audio.srcObject === stream) {
      return
    }
    $audio.srcObject = stream
    $audio.paused && $audio.play()
  }, [stream])
  return <audio ref={audioRef} />
}

export default Test
