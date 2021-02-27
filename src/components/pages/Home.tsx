import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Peer from "skyway-js";
import { DefaultLayouts } from "../templates";
import { RoomCard, CreateRoomDrawer, NoRoomName, Header } from "../organisms";

const Home = () => {
  const names = ["Mike", "John"];
  const [peers, setPeers] = useState<string[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rooms = [
    "yNtQkNyjAojJNGrt",
    "yNtQkNyjAojJNGrt",
    "yNtQkNyjAojJNGrt",
    "yNtQkNyjAojJNGrt",
  ];

  const roomNames = useMemo(
    () =>
      rooms
        .filter((room) => room.includes("-"))
        .map((room) => room.split("-")[1]),
    [rooms]
  );

  useEffect(() => {
    const peer = new Peer({
      key: process.env.REACT_APP_SKYWAY_API_KEY,
    });
    peer.on("open", () => {
      peer.listAllPeers((peers) => {
        setPeers(peers);
      });
    });
  }, []);

  return (
    <DefaultLayouts>
      <Header />
      {roomNames.length === 0 && <NoRoomName />}
      {/* TODO: roomName[]に変更する */}
      {peers.map((peer, index) => (
        <Link
          key={index}
          to={{
            pathname: `/Room/${peer}`,
            state: {
              admin: false,
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <RoomCard title={peer} names={names} roomNumber={10} />
        </Link>
      ))}
      <CreateRoomDrawer />
    </DefaultLayouts>
  );
};

export default Home;
