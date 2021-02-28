import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLocation, RouteComponentProps, Link } from "react-router-dom";
import Peer, { MeshRoom } from "skyway-js";
import {
  Box,
  IconButton,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { Audio, Avator, Button } from "../atoms";
import { DefaultLayouts } from "../templates";
import { useUniqueString } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";

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
  const messageEl = useRef<HTMLDivElement>(null);

  const uniqueString = useUniqueString();

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [audioMedias, setAudioMedias] = useState<MediaStreamWithPeerId[]>([]);

  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleClick = useCallback(() => {
    if (roomRef.current === null || message === "") {
      return;
    }
    roomRef.current.send(message);
    setMessages([...messages, message]);
    setMessage("");
  }, [message, messages]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setMessage(e.target.value);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (messageEl) {
      (messageEl.current as any).addEventListener(
        "DOMNodeInserted",
        (event: { currentTarget: any }) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        }
      );
    }
  }, []);

  // TODO: get users
  const users = ["john", "mike", "jack"];

  return (
    <DefaultLayouts>
      {audioMedias.map((media, index) => (
        <Audio key={`media.peerId-${index}`} stream={media} />
      ))}
      <Box className={classes.root}>
        <Box className={classes.mainContentsContainer}>
          <Typography>{roomId}</Typography>
          <Grid
            className={classes.iconContainer}
            container
            justify="center"
            spacing={2}
          >
            {/* TODO: get users */}
            {users.map((user) => (
              <Grid item>
                <Avator name={user} bgColor="primary" margin={1} />
              </Grid>
            ))}
          </Grid>
          <Box {...{ ref: messageEl }} className={classes.messageContainer}>
            {messages.map((message, index) => (
              <Box key={index} className={classes.message}>
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
              value={message}
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
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Button variant="contained" isGreen={false} size="small">
                ✌️ Leave quietly
              </Button>
            </Link>
            {isMuted ? (
              <IconButton
                className={classes.volumeOffIconButton}
                aria-label="unmute"
                onClick={unmute}
              >
                <VolumeOffOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                className={classes.volumeOnIconButton}
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

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: "100vh",
    width: "100%",
  },
  mainContentsContainer: {
    height: "720px",
    width: "100%",
    position: "absolute",
    bottom: "0",
    backgroundColor: "#fff",
    borderRadius: "25px 25px 0 0",
    boxShadow: "0 3px 6px -2px rgb(0 10 60 / 20%)",
    paddingTop: "20px",
  },
  InteractionContainer: {
    position: "absolute",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "120px",
    width: "100%",
    bgcolor: "#fff",
    paddingTop: "10px",
    boxShadow: "0 -3px 6px -2px rgb(0 10 60 / 20%)",
  },
  iconContainer: {
    height: "130px",
    marginTop: "10px",
    overflow: "scroll",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "400px",
    width: "100%",
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  message: {
    width: "220px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "10px 20px",
    backgroundColor: "#F2F2F2",
    borderRadius: "5px",
    textAlign: "left",
    overflowWrap: "break-word",
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
  volumeOnIconButton: {
    backgroundColor: "#F2F2F2",
    color: "#35AD5E",
  },
  volumeOffIconButton: {
    backgroundColor: "#F2F2F2",
    color: "#B76663",
  },
});
