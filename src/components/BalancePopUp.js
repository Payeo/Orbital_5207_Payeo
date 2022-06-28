import React, { useState } from "react";

import { auth, db } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
 
const BalancePopup = props => {
  const { convoId } = useParams();  
  const [balance, setBalance] = useState("");
  const currentUser = auth.currentUser.uid; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (balance === "") {
      alert("Please enter a valid amount.");
    } else {
      const text = "$" + balance + " has been recorded";

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        text,
        from: currentUser,
        createdAt: Timestamp.fromDate(new Date()),
        media: "",
      });

      setBalance("");
    }
  };

  return (
    <div className="popup_box">
      <div className="box">
      <span className="close_icon" onClick={props.handleClose}>x</span>
        <b>Credit / Debit</b>
        <div className="button_div">
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Enter balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)} />
            <div className="button_div">
              <button className="btn" type="submit">Credit</button>
              <button className="btn" type="submit">Debit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default BalancePopup;