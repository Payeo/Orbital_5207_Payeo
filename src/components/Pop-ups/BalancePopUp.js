import React, { useState } from "react";

import { db } from "../../firebase";
import Img from "../media/default.png";
import {
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import CreditDebitPopup from "./CreditDebitPopup";
import Plus from "../media/plus.svg";
 
const BalancePopup = props => {
  const { convoId } = useParams();  
  const [ isOpen, setIsOpen ] = useState();
  const [balance, setBalance] = useState("");

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="popup_box" onClick={props.handleClose}>
      {isOpen && <CreditDebitPopup handleClose={togglePopup} convoId={convoId} currentUser={props.currentUser}/>}
      <div className="box" onClick={event => event.stopPropagation()}>
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.handleClose} cursor="pointer">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
        <div className="popup_avatar">
          <img
              className="avatar"
              src={props.users?.[0]?.data()?.avatar || Img}
              alt=""
            />
          <h1>{props.users[0]?.data().name}</h1>
          <button className="transaction_button" onClick={() => togglePopup()}><img src={Plus} alt="plus"></img></button>
        </div>
        <div>
          <div className="calculated">
            You Owe/ Owes you $123
          </div>
        </div>
        <div className="balance_div">
          <h3>Credit</h3>
          <div className="calculated">
            <div className="you_owe">
              $123
            </div>
          </div>
        </div>
        <div className="balance_div">
          <h3>Debit</h3>
          <div className="calculated">
            <div className="owed">
                $123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default BalancePopup;