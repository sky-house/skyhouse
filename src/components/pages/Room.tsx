import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLocation, RouteComponentProps } from "react-router-dom";
import Peer, { MeshRoom } from "skyway-js";
import { Box, IconButton, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { Audio, Button } from "../atoms";
import { DefaultLayouts } from "../templates";
import { useUniqueString } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";

const useStyles = makeStyles({
  InteractionContainer: {
    position: "absolute",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    bgcolor: "#fff",
    paddingTop: "10px",
    paddingBottom: "10px",
    boxShadow: "0 -3px 6px -2px rgb(0 10 60 / 20%)",
  },
  TextFieldContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "95%",
    marginBottom: "15px",
  },
  userActionsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: "5px",
  },
  audioIconButton: {
    backgroundColor: "#F2F2F2",
  },
});

interface MediaStreamWithPeerId extends MediaStream {
  peerId: string;
}

interface LinkState {
  [key: string]: boolean;
}

interface Props extends RouteComponentProps<{ roomId: string }> {}

const Room: React.FC<Props> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const { roomId } = props.match.params;
  const roomRef = useRef<MeshRoom>(null);

  const uniqueString = useUniqueString();

  const [messages, setMessages] = useState<string[]>([]);
  const messageRef = useRef("");
  const [audioMedias, setAudioMedias] = useState<MediaStreamWithPeerId[]>([]);

  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleClick = useCallback(() => {
    if (roomRef.current === null) {
      return;
    }
    roomRef.current.send(messageRef.current);
    setMessages([...messages, messageRef.current]);
    messageRef.current = "";
  }, [messages]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      messageRef.current = e.target.value;
    },
    []
  );

  function mute() {
    if (audioTrackRef.current === null) {
      return;
    }
    audioTrackRef.current.enabled = false;
    setIsMuted(true);
  }

  function unmute() {
    if (audioTrackRef.current === null) {
      return;
    }
    audioTrackRef.current.enabled = true;
    setIsMuted(false);
  }

  // チャット用のEffect
  useEffect(() => {
    const isAdmin = (location.state as LinkState).admin;
    const originalPeerId = isAdmin ? `${uniqueString}-${roomId}` : uniqueString;
    const peer = new Peer(originalPeerId, {
      key: process.env.REACT_APP_SKYWAY_API_KEY,
      // debug: 3,
    });
    peer.on("open", () => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((localStream) => {
          localStream.getAudioTracks()[0].enabled = false;
          audioTrackRef.current = localStream.getAudioTracks()[0];
          const room = peer.joinRoom(roomId, { stream: localStream });
          // @ts-ignore
          roomRef.current = room;
          room.on("open", () => {
            console.log("open", room);
            room.getLog();
          });
          room.on("log", (logs) => {
            const chats = logs
              .map((log) => JSON.parse(log))
              .filter((log) => log.messageType === "ROOM_DATA")
              .map((log) => log.message.data);
            setMessages((prev) => [...prev, ...chats]);
          });
          room.on("data", ({ src, data }) => {
            console.log("data", data);
            setMessages((prev) => [...prev, data]);
          });
          room.on("stream", (stream) => {
            console.log("stream", stream);
            setAudioMedias((prev) => [...prev, stream]);
          });
          // room.on('peerJoin', peerId => {})
          room.on("peerLeave", (peerId) => {
            setAudioMedias((prev) =>
              prev.filter((media) => media.peerId !== peerId)
            );
          });
        })
        .catch(console.error);
    });
  }, [location.state, roomId, uniqueString]);

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
        <Box className={classes.InteractionContainer}>
          <Box className={classes.TextFieldContainer}>
            <TextField
              id="chat"
              type="text"
              multiline={true}
              size="small"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              size="small"
              onClick={handleClick}
            >
              Send
            </Button>
          </Box>
          <Box className={classes.userActionsContainer}>
            <Button
              variant="contained"
              isGreen={false}
              size="small"
              onClick={handleClick}
            >
              ✌️ Leave quietly
            </Button>
            {isMuted ? (
              <IconButton
                className={classes.audioIconButton}
                aria-label="unmute"
                onClick={unmute}
              >
                <VolumeOffOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                className={classes.audioIconButton}
                aria-label="mute"
                onClick={mute}
              >
                <VolumeUpOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </DefaultLayouts>
  );
};

export default Room;
