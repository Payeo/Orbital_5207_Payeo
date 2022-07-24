import React from "react";
import SideBar from "../components/SideBar/SideBar"

const Home = () => {
  return (
    <div className="home_container_no_convo">
      <div className="users_container_no_convo">
        <SideBar></SideBar>
      </div>
      <div className="messages_container_no_convo">
        <div className="no_conv">Select a user to start conversation</div>
      </div>
    </div>
  );
};

export default Home;
