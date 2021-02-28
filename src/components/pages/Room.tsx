import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
import { SimpleSnackBar } from "../organisms";
import { DefaultLayouts } from "../templates";
import { chooseAnimalName } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";

interface MediaStreamWithPeerId extends MediaStream {
  peerId: string;
}

interface LinkState {
  [key: string]: boolean;
}

interface RoomState {
  users: string[];
}

interface Props extends RouteComponentProps<{ roomId: string }> {}

interface ChatEvent {
  kind: "ChatEvent";
  peerId: string;
  message: string;
}

interface AllowUnmuteEvent {
  kind: "AllowUnmuteEvent";
  allowedPeerId: string;
}

function filterEvents(events: (ChatEvent | AllowUnmuteEvent)[]) {
  return {
    chatEvents: events.filter((e) => e.kind === "ChatEvent") as ChatEvent[],
    allowUnmuteEvents: events.filter(
      (e) => e.kind === "AllowUnmuteEvent"
    ) as AllowUnmuteEvent[],
  };
}

const Room: React.FC<Props> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const { roomId } = props.match.params;
  const roomRef = useRef<MeshRoom>(null);
  const messageEl = useRef<HTMLDivElement>(null);

  const users = useMemo(() => (location.state as RoomState).users || [], [
    location.state,
  ]);

  const [chatHistory, setChatHistory] = useState<ChatEvent[]>([]);
  const [message, setMessage] = useState("");
  const [audioMedias, setAudioMedias] = useState<MediaStreamWithPeerId[]>([]);

  const connectedPeerIds = useMemo(
    () => audioMedias.map((media) => media.peerId),
    [audioMedias]
  );
  const [speakerPeerIds, setSpeakerPeerIds] = useState<string[]>([]);
  const isAdmin = useMemo(() => (location.state as LinkState).admin, [
    location,
  ]);

  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const peerId = useRef<string>("");

  const myAnimalName = useRef("");

  const handleClickSend = useCallback(() => {
    if (roomRef.current === null || message === "") {
      return;
    }
    roomRef.current.send({ kind: "ChatEvent", peerId, message });
    setChatHistory((prev) => [
      ...prev,
      { kind: "ChatEvent", peerId: peerId.current, message },
    ]);
    setMessage("");
  }, [message]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  function handleAllowUnmuteAsAdmin(peerId: string) {
    if (roomRef.current === null || !isAdmin) {
      return;
    }
    setSpeakerPeerIds((prev) => [...prev, peerId]);
    const event: AllowUnmuteEvent = {
      kind: "AllowUnmuteEvent",
      allowedPeerId: peerId,
    };
    roomRef.current.send(event);
  }

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
    isAdmin && setIsSpeaker(true);
    const animalName = chooseAnimalName(users);
    myAnimalName.current = animalName;
    const originalPeerId = isAdmin
      ? `${animalName}-${roomId}-admin`
      : `${animalName}-${roomId}`;
    peerId.current = originalPeerId;
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
            room.getLog();
          });
          room.on("log", (logs) => {
            const events = logs
              .map((log) => JSON.parse(log))
              .filter((log) => log.messageType === "ROOM_DATA");
            const { allowUnmuteEvents, chatEvents } = filterEvents(events);
            setChatHistory((prev) => [...prev, ...chatEvents]);
            const speakers = allowUnmuteEvents.map((e) => e.allowedPeerId);
            setSpeakerPeerIds((prev) => [...prev, ...speakers]);
          });
          room.on(
            "data",
            ({
              src,
              data,
            }: {
              src: any;
              data: ChatEvent | AllowUnmuteEvent;
            }) => {
              if (data.kind === "ChatEvent") {
                setChatHistory((prev) => [...prev, data]);
              } else if (data.kind === "AllowUnmuteEvent") {
                setSpeakerPeerIds((prev) => [...prev, data.allowedPeerId]);
                if (data.allowedPeerId === peerId.current) {
                  setIsSpeaker(true);
                }
              }
            }
          );
          room.on("stream", (stream) => {
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

  return (
    <DefaultLayouts>
      {audioMedias.map((media, index) => (
        <Audio key={`media.peerId-${index}`} stream={media} />
      ))}
      {!isAdmin && isSpeaker && <SimpleSnackBar />}
      <Box className={classes.root}>
        <Box className={classes.mainContentsContainer}>
          <Box className={classes.iconContainer}>
            <Typography
              className={classes.typography}
              align="left"
              variant="subtitle1"
            >
              {roomId}
            </Typography>
            <Grid
              container
              className={classes.speakerGrid}
              justify="center"
              spacing={2}
            >
              <Grid item>
                <Avator
                  name={myAnimalName.current}
                  bgColor="primary"
                  margin={1}
                />
              </Grid>
              {speakerPeerIds.map((speakerPeerId, index) => (
                <Grid item key={index}>
                  <Avator name={speakerPeerId} bgColor="primary" margin={1} />
                </Grid>
              ))}
            </Grid>
            <Typography
              className={classes.typography}
              align="left"
              variant="subtitle2"
            >
              Audiences in the room
            </Typography>
            <Grid
              className={classes.iconContainer}
              container
              justify="center"
              spacing={2}
            >
              {connectedPeerIds
                .filter((id) => !speakerPeerIds.includes(id))
                .map((connectedPeerId, index) => (
                  <Grid item key={index}>
                    <Avator
                      name={connectedPeerId.split("-")[0]}
                      bgColor="primary"
                      margin={1}
                    />
                    {isAdmin && (
                      <button
                        onClick={() =>
                          handleAllowUnmuteAsAdmin(connectedPeerId)
                        }
                      >
                        Invite
                      </button>
                    )}
                  </Grid>
                ))}
            </Grid>
          </Box>
          <Typography
            className={classes.typography}
            align="left"
            variant="subtitle2"
          >
            Chats in the room
          </Typography>
          <Box {...{ ref: messageEl }} className={classes.messageContainer}>
            {chatHistory.map((chat, index) => (
              <Box key={index} className={classes.message}>
                {chat.message}
              </Box>
            ))}
          </Box>
        </Box>
        <Box className={classes.InteractionContainer}>
          <Box className={classes.TextFieldContainer}>
            <TextField
              id="chat"
              type="text"
              size="small"
              value={message}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClickSend();
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              size="small"
              onClick={handleClickSend}
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
            {isSpeaker &&
              (isMuted ? (
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
              ))}
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
  typography: {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "20px",
    marginRight: "20px",
    borderBottom: "solid 2px #F2F2F2",
  },
  speakerGrid: {
    minHeight: "50px",
  },
  mainContentsContainer: {
    height: "750px",
    width: "100%",
    position: "absolute",
    bottom: "0",
    backgroundColor: "#fff",
    borderRadius: "25px 25px 0 0",
    boxShadow: "0 3px 6px -2px rgb(0 10 60 / 20%)",
    // paddingTop: "20px",
    // overflow: "auto",
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
    backgroundColor: "#fff",
    boxShadow: "0 -3px 6px -2px rgb(0 10 60 / 20%)",
  },
  iconContainer: {
    height: "150px",
    marginTop: "20px",
    marginBottom: "10px",
    overflow: "auto",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "400px",
    width: "100%",
    overflow: "auto",
    backgroundColor: "#fff",
  },
  message: {
    width: "200px",
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
