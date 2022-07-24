import React, { useState } from "react";

import { db } from "../../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import { useRef } from "react";
import { useDocumentQuery } from "../../hooks/useDocumentQuery";
 
const CreditDebitPopup = props => {
  const [balance, setBalance] = useState("");
  const [remarks, setRemarks] = useState("");
  const buttonUsed = useRef();
  var credit = 0;
  var debit = 0;

  const creditData = useDocumentQuery(
    `conversation-${props.convoId}`,
    doc(db, "conversations", props.convoId, "balance", props.currentUser)
  );

  const debitData= useDocumentQuery(
    `conversation-${props.convoId}`,
    doc(db, "conversations", props.convoId, "balance", props.otherUser.uid)
  );

  if (creditData.data?.data() !== undefined) {
    credit = creditData.data?.data().amount;
  }

  if (debitData.data?.data() !== undefined) {
    debit = debitData.data?.data().amount;
  }

  const handleSubmit = async (e) => {
    console.log(buttonUsed.current.buttonId);
    e.preventDefault();
    if (balance === "") { 
      alert("Please enter a valid amount.");
    } else {
      // eslint-disable-next-line
      if (buttonUsed.current.buttonId == "0") {
        const text = "$" + balance + " has been Credited. Remarks: " + remarks;
        const amount = Number(balance) + Number(credit);

        await addDoc(collection(db, "conversations", props.convoId, "messages"), {
          text,
          type: "Credit",
          from: props.currentUser,
          createdAt: Timestamp.fromDate(new Date()),
          media: "",
        });

        await setDoc(doc(db, "conversations", props.convoId, "balance", props.currentUser), {
          from: props.currentUser,
          to: props.otherUser.uid,
          remarks: remarks,
          amount: amount,
          createdAt: Timestamp.fromDate(new Date()),
        });

        // eslint-disable-next-line
      } else if (buttonUsed.current.buttonId == "1") {
        const text = "$" + balance + " has been Debited. Remarks: " + remarks;
        // eslint-disable-next-line
        const amount = debit == 0 ? balance : Number(debit) + Number(balance);

        await addDoc(collection(db, "conversations", props.convoId, "messages"), {
          text,
          type: "Debit",
          from: props.currentUser,
          createdAt: Timestamp.fromDate(new Date()),
          media: "",
        });
  
        await setDoc(doc(db, "conversations", props.convoId, "balance", props.otherUser.uid), {
          from: props.otherUser.uid,
          to: props.currentUser,
          remarks: remarks,
          amount: amount,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }  
      setBalance("");
      setRemarks("");
    }
  };

  return (
    <div className="creditdebit_popup_box" onClick={props.handleClose}>
        <div className="creditdebit_popup" onClick={event => event.stopPropagation()}>
            <div className="creditdebit">
            <form onSubmit={handleSubmit} ref={buttonUsed}>
                <input
                type="number"
                placeholder="Enter the amount"
                value={balance}
                onChange={(e) => setBalance(e.target.value)} />
                <input 
                type="string"
                placeholder="Remarks (Optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}/>
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