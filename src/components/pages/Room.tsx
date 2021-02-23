import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { DefaultLayouts } from '../templates'
import { Button } from '../atoms'
import { Box, TextField } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import { RouteComponentProps } from 'react-router-dom'
import Peer, { MeshRoom } from 'skyway-js'
import { Audio } from '../atoms/Audio'

interface MediaStreamWithPeerId extends MediaStream {
  peerId: string
}

interface Props extends RouteComponentProps<{ roomId: string }> {}

const Room: React.FC<Props> = (props) => {
  const { roomId } = props.match.params
  const roomRef = useRef<MeshRoom>(null)

  const [messages, setMessages] = useState<string[]>([])
  const messageRef = useRef('')
  const [audioMedias, setAudioMedias] = useState<MediaStreamWithPeerId[]>([])

  const audioTrackRef = useRef<MediaStreamTrack | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  const handleClick = useCallback(() => {
    if (roomRef.current === null) {
      return
    }
    roomRef.current.send(messageRef.current)
    setMessages([...messages, messageRef.current])
    messageRef.current = ''
  }, [messages])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      messageRef.current = e.target.value
    },
    []
  )

  function mute() {
    if (audioTrackRef.current === null) {
      return
    }
    audioTrackRef.current.enabled = false
    setIsMuted(true)
  }

  function unmute() {
    if (audioTrackRef.current === null) {
      return
    }
    audioTrackRef.current.enabled = true
    setIsMuted(false)
  }

  // チャット用のEffect
  useEffect(() => {
    const peer = new Peer({
      key: process.env.REACT_APP_SKYWAY_API_KEY,
      // debug: 3,
    })
    peer.on('open', () => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((localStream) => {
          localStream.getAudioTracks()[0].enabled = false
          audioTrackRef.current = localStream.getAudioTracks()[0]
          const room = peer.joinRoom(roomId, { stream: localStream })
          // @ts-ignore
          roomRef.current = room
          room.on('open', () => {
            console.log('open', room)
            room.getLog()
            navigator.mediaDevices
              .getUserMedia({ audio: true, video: false })
              .then((stream) => {
                console.log('replaceStream', stream)
                room.replaceStream(stream)
              })
          })
          room.on('log', (logs) => {
            const chats = logs
              .map((log) => JSON.parse(log))
              .filter((log) => log.messageType === 'ROOM_DATA')
              .map((log) => log.message.data)
            setMessages((prev) => [...prev, ...chats])
          })
          room.on('data', ({ src, data }) => {
            console.log('data', data)
            setMessages((prev) => [...prev, data])
          })
          room.on('stream', (stream) => {
            console.log('stream', stream)
            setAudioMedias((prev) => [...prev, stream])
          })
          // room.on('peerJoin', peerId => {})
          room.on('peerLeave', (peerId) => {
            setAudioMedias((prev) =>
              prev.filter((media) => media.peerId !== peerId)
            )
          })
        })
        .catch(console.error)
    })
  }, [roomId])

  return (
    <DefaultLayouts>
      {audioMedias.map((media) => (
        <Audio key={media.peerId} stream={media} />
      ))}
      <Box position="relative" height="100vh" width="100%">
        <Box
          height="90vh"
          width="100%"
          position="absolute"
          bottom="0"
          bgcolor="#fff"
          borderRadius="25px 25px 0 0"
          boxShadow="0 3px 6px -2px rgb(0 10 60 / 20%)"
        >
          icons
          <Box>
            {messages.map((message) => (
              <Box key={message} bgcolor="#fff">
                {message}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          position="absolute"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          width="100%"
          bottom="0"
          bgcolor="#fff"
          boxShadow="0 -3px 6px -2px rgb(0 10 60 / 20%)"
          pt={2}
          pb={2}
        >
          <TextField
            id="chat"
            type="text"
            multiline={true}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="default"
            endIcon={<SendIcon />}
            onClick={handleClick}
          >
            送信
          </Button>
          {isMuted && "ミュート中です"}
          {isMuted && <Button onClick={() => unmute()}>ミュート解除</Button>}
          {!isMuted && <Button onClick={() => mute()}>ミュート</Button>}
        </Box>
      </Box>
    </DefaultLayouts>
  )
}

export default Room
