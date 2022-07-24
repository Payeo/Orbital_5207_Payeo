import React, { useState } from "react";

import { db } from "../../firebase";
import Img from "../media/default.png";
import { doc, addDoc, setDoc, Timestamp, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";
import CreditDebitPopup from "./CreditDebitPopup";
import { useDocumentQuery } from "../../hooks/useDocumentQuery";
import Plus from "../media/plus.svg";
 
const BalancePopup = props => {
  const { convoId } = useParams();  
  const [ isOpen, setIsOpen ] = useState();

  var credit = 0;
  var debit = 0;

  const creditData = useDocumentQuery(
    `conversation-${convoId}`,
    doc(db, "conversations", convoId, "balance", props.currentUser)
  );

  const debitData= useDocumentQuery(
    `conversation-${convoId}`,
    doc(db, "conversations", convoId, "balance", props.users[0]?.data().uid)
  );

  if (creditData.data?.data() !== undefined) {
    credit = creditData.data?.data()?.amount;
  }

  if (debitData.data?.data() !== undefined) {
    debit = debitData.data?.data()?.amount;
  }

  const result = debit - credit;

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const toggleApplication = async () => {
    await addDoc(collection(db, "conversations", convoId, "messages"), {
      text: "The payment has been made.",
      type: "Payment",
      from: props.currentUser,
      createdAt: Timestamp.fromDate(new Date()),
      media: "",
    });

    await setDoc(doc(db, "conversations", convoId, "balance", props.currentUser), {
      from: props.currentUser,
      to: props.users[0]?.data().uid,
      remarks: "Payment made",
      amount: 0,
      createdAt: Timestamp.fromDate(new Date()),
    });

    await setDoc(doc(db, "conversations", convoId, "balance", props.users[0]?.data().uid), {
      from: props.users[0]?.data().uid,
      to: props.currentUser,
      remarks: "Payment made",
      amount: 0,
      createdAt: Timestamp.fromDate(new Date()),
    });

    var now = new Date().valueOf();
    setTimeout(function () {
        if (new Date().valueOf() - now > 100) return;
        window.location = "https://apps.apple.com/sg/app/dbs-paylah/id878528688";
    }, 25);
    window.location = "appname://";
  }

  return (
    <div className="popup_box">
      {isOpen && <CreditDebitPopup handleClose={togglePopup} convoId={convoId} currentUser={props.currentUser} otherUser={props.users[0]?.data()} />}
      <div className="box">
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.handleClose} cursor="pointer">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
        <div className="popup_avatar">
          <img
              className="avatar"
              src={props.users[0]?.data()?.avatar || Img}
              alt=""
            />
          <h1>{props.users[0]?.data().name}</h1>
          <button className="transaction_button" onClick={() => togglePopup()}><img src={Plus} alt="plus"></img></button>
        </div>
        <div className="calculated_div">
          <div className="balance_div">
            <div className="calculated">
              {result > 0 ? <><h3>Owes you:</h3><div className="owed"> {result} </div></> : <><h3>You Owe: </h3><div className="you_owe"> ${-1 * result} </div></>}
            </div>
          </div>
            <div className="balance_div">
            <div className="calculated">
              <h3>Credit</h3>
              <div className="you_owe">
                ${credit}
              </div>
            </div>
            <div className="calculated">
              <h3>Debit</h3>
              <div className="owed">
                  ${debit}
              </div>
            </div>
          </div>
          <div className="balance_div">
        </div>
          <button className="btn" onClick={() => toggleApplication()}>Pay Now</button>
          <button className="btn">Chat Now</button>
        </div>
      </div>
    </div>
  );
};
 
export default BalancePopup;