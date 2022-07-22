import React, { useState } from "react";

import { db } from "../../firebase";
import {
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { useRef } from "react";
import { useParams } from "react-router-dom";
 
const CreditDebitPopup = props => {
  const [balance, setBalance] = useState("");
  const buttonUsed = useRef();

  const handleSubmit = async (e) => {
    console.log(props.convoId);
    e.preventDefault();
    if (balance === "") {
      alert("Please enter a valid amount.");
    } else {
      if (buttonUsed.current.buttonId === 0) {
        const text = "$" + balance + " has been Credited";

        await addDoc(collection(db, "conversations", props.convoId, "messages"), {
          text,
          from: props.currentUser,
          createdAt: Timestamp.fromDate(new Date()),
          media: "",
        });
  
        setBalance("");
      } else {
        const text = "$" + balance + " has been Debited";

        await addDoc(collection(db, "conversations", props.convoId, "messages"), {
          text,
          from: props.currentUser,
          createdAt: Timestamp.fromDate(new Date()),
          media: "",
        });
  
        setBalance("");
      }  

    }
  };

  return (
    <div className="creditdebit_popup_box" onClick={props.handleClose}>
        <div className="creditdebit_popup" onClick={event => event.stopPropagation()}>
            <div className="creditdebit">
            <form onSubmit={handleSubmit} ref={buttonUsed}>
                <input
                type="number"
                placeholder="Enter balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)} />
                <div className="button_div">
                    <button className="btn" type="submit" id={0} onClick={e => buttonUsed.current.buttonId=e.target.id}>Credit</button>
                    <button className="btn" type="submit" id={1} onClick={e => buttonUsed.current.buttonId=e.target.id}>Debit</button>
                </div>
            </form>
            </div>
        </div>
    </div>
  );
};
 
export default CreditDebitPopup;