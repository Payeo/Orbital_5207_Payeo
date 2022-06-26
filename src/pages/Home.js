import React from "react";
import SideBar from "../components/Chat/SideBar"

const Home = () => {
  return (
    <div className="home_container">
      <SideBar></SideBar>
      <div className="messages_container">
        <div className="no_conv">Select a user to start conversation</div>
      </div>
    </div>
  );
};

export default Home;
