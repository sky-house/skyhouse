import React, { useCallback, useState, useRef, useEffect } from "react";
import { DefaultLayouts } from "../templates";
import { Button } from "../atoms";
import { Box, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { RouteComponentProps } from 'react-router-dom'
import Peer, { MeshRoom } from 'skyway-js'

interface Props extends RouteComponentProps<{ roomId: string }> {}

const Room: React.FC<Props> = (props) => {
  const { roomId } = props.match.params
  const roomRef = useRef<MeshRoom>(null)

  const [messages, setMessages] = useState<string[]>(["aaaa", "bbbb", "cccc"]);
  const messageRef = useRef("");

  const handleClick = useCallback(() => {
    if (roomRef.current === null) {
      return
    }
    roomRef.current.send(messageRef.current)
    setMessages([...messages, messageRef.current]);
    messageRef.current = ""
  }, [messages]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      messageRef.current = e.target.value;
    },
    []
  );

  // チャット用のEffect
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
        setMessages(prev => [...prev, ...chats])
      })
      room.on('data', ({ src, data }) => {
        console.log('data', data)
        setMessages((prev) => [...prev, data])
      })
      // room.on('stream', (stream) => {
      //   setAudioMedias([...audioMedias, stream])
      // })
      // room.on('peerJoin', peerId => {})
      // room.on('peerLeave', (peerId) => {
      //   setAudioMedias(audioMedias.filter((media) => media.peerId !== peerId))
      // })
    })
  }, [roomId])

  return (
    <DefaultLayouts>
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
              <Box bgcolor="#fff">{message}</Box>
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
        </Box>
      </Box>
    </DefaultLayouts>
  );
};

export default Room;
