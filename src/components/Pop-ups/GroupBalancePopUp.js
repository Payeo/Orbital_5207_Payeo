import React, { useState } from "react";

import { db } from "../../firebase";
import {
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
 
const GroupBalancePopup = props => {
  const { convoId } = useParams();  
  const [balance, setBalance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (balance === "") {
      alert("Please enter a valid amount.");
    } else {
      const text = "$" + balance + " has been recorded";

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        text,
        from: props.currentUser,
        createdAt: Timestamp.fromDate(new Date()),
        media: "",
      });

      setBalance("");
    }
  };

  return (
    <div className="popup_box">
      <div className="box">
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.handleClose} cursor="pointer">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
        <b>Group Balance</b>
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
 
export default GroupBalancePopup;