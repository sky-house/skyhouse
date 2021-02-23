import React from "react";
import { DefaultLayouts } from "../templates";
import { RoomCard } from "../organisms";

const Home = () => {
  const names = ["Mike", "John"];
  return (
    <DefaultLayouts>
      <RoomCard
        title="SkyWayでClubhouseのクローンを作った話✨"
        names={names}
        roomNumber={10}
      />
    </DefaultLayouts>
  );
};

export default Home;
