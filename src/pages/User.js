import React, { useState, useEffect } from "react";
import Img from "../components/media/default.png";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import SideBar from "../components/SideBar/SideBar";
import { useParams } from "react-router-dom";

const User = () => {
  const { userId } = useParams();
  const [ user, setUser ] = useState();  
  var credit = 0;
  var debit = 0;

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
        <div className="user_profile_container">
          <div className="profile_container">
            <div className="img_container">
              <img src={Img} alt="avatar" />
            </div>
            <div className="text_container">
              <h1>{user?.name}</h1>
              <p>{user?.email}</p>
              <p>Joined on: {user?.createdAt.toDate().toDateString()}</p>
            </div>
          </div>
          <div className="balance_container">
            <div className="balance">
              <div className="debit">
                <h3>Total amount owed</h3>
                <p className="owed">${credit}</p>
              </div>
              <div className="credit">
                <h3>Total amount you owe</h3>
                <p className="you_owe">${debit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default User;
