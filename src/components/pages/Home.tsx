import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Peer from "skyway-js";
import { DefaultLayouts } from "../templates";
import { RoomCard, CreateRoomDrawer, NoRoomName, Header } from "../organisms";
import { Box } from "@material-ui/core";

/**
 * 15sec interval
 */
const getListAllPeersInterval = 20 * 1000;

const Home = () => {
  const [peers, setPeers] = useState<string[]>([]);

  const roomNames = useMemo(
    () =>
      Array.from(new Set(peers.filter((room) => room.includes("admin")))).map(
        (room) => room.split("-")[1]
      ),
    [peers]
  );

  const rooms = useMemo(
    () => {
      return roomNames.map(roomName => {
        return {
          name: roomName,
          admin: peers.filter(peer => peer.includes(`${roomName}-admin`)).map(peer => peer.split("-")[0]),
          users: peers.filter(peer => peer.includes(`${roomName}`)).map(peer => peer.split("-")[0])
        }
      })
    },[peers, roomNames]
  )

  useEffect(() => {
    const getListAllPeers = () => {
      const peer = new Peer({
        key: process.env.REACT_APP_SKYWAY_API_KEY,
      });
      peer.on("open", () => {
        peer.listAllPeers((peers) => {
          setPeers(peers);
        });
      });
    };
    getListAllPeers();
    const timerId = setInterval(getListAllPeers, getListAllPeersInterval);
    return () => clearInterval(timerId);
  }, []);

  return (
    <DefaultLayouts>
      <Header />
      <Box marginBottom="120px">
        {roomNames.length === 0 && <NoRoomName />}
        {/* TODO: roomName[]に変更する */}
        {rooms.map((room, index) => (
          <Link
            key={index}
            to={{
              pathname: `/Room/${room.name}`,
              state: {
                admin: false,
                users: room.users
              },
            }}
            style={{ textDecoration: "none" }}
          >
            <RoomCard title={room.name} names={room.admin} roomNumber={10} />
          </Link>
        ))}
      </Box>
      <CreateRoomDrawer />
    </DefaultLayouts>
  );
};

export default Home;
