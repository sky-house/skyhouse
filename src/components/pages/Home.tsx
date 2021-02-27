import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Peer from "skyway-js";
import { DefaultLayouts } from "../templates";
import { RoomCard, CreateRoomDrawer, NoRoomName, Header } from "../organisms";

const Home = () => {
  const names = ["Mike", "John"];
  const [peers, setPeers] = useState<string[]>([]);

  const roomNames = useMemo(
    () =>
      peers
        .filter((room) => room.includes("-"))
        .map((room) => room.split("-")[1]),
    [peers]
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
      {roomNames.map((roomName, index) => (
        <Link
          key={index}
          to={{
            pathname: `/Room/${roomName}`,
            state: {
              admin: false,
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <RoomCard title={roomName} names={names} roomNumber={10} />
        </Link>
      ))}
      <CreateRoomDrawer />
    </DefaultLayouts>
  );
};

export default Home;
