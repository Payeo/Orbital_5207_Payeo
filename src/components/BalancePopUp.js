import React, { useState } from "react";

import { db } from "../firebase";
import {
  doc,
  collection,
  Timestamp,
  setDoc,
} from "firebase/firestore";
 
const BalancePopup = props => {

  
  const [balance, setBalance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user1 = props.user1;
    const user2 = props.user2;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    await setDoc(doc(db, "balance", id), {
      balance,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
    });

    setBalance("");
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