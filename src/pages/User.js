import React, { useState, useEffect } from "react";
import Img from "../components/media/default.png";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import SideBar from "../components/SideBar/SideBar";
import { useParams } from "react-router-dom";

const User = () => {
  const { userId } = useParams();
  const [ user, setUser ] = useState();

  useEffect(() => {
    getDoc(doc(db, "users", userId)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  });

  return (
    <>
      <div className="home_container">
        <div className="users_container">
            <SideBar></SideBar>
        </div>
        <div className="messages_container">
          <div className="profile_container">
            <div className="img_container">
              <img src={Img} alt="avatar" />
                <div className="overlay">
                    <div>
                    </div>
                </div>
            </div>
            <div className="text_container">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <hr />
              <small>Joined on: {user?.createdAt.toDate().toDateString()}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default User;
