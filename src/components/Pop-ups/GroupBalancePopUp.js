import React, { useState } from "react";

import { db } from "../../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useDocumentQuery } from "../../hooks/useDocumentQuery";
import { useUsersInfo } from "../../hooks/useUsersInfo";
 
const GroupBalancePopup = props => {
  const { convoId } = useParams();  
  const [ balance, setBalance ] = useState("");
  const [ percentage, setPercentage ] = useState([]);

  const { data } = useDocumentQuery(
    `conversation-${convoId}`,
    doc(db, "conversations", convoId)
  )

  const usersData = data?.data()?.users;

  const { data: users } = useUsersInfo(usersData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sum = percentage => Object.values(percentage).map(x => parseInt(x)).reduce((a, b) => a + b);
    console.log(sum(percentage));
    if (balance === "") {
      alert("Please enter a valid amount.");
    } else if (sum(percentage) !== 100){
      alert("Please add percentages that add up to a 100%.")
    } else {
      for (let i = 0; i < users.length; i++) {
        const amount = balance * percentage[i]/100;
        const amountString = (Math.round(amount * 100) / 100).toFixed(2);
        let msg = users[i]?.data().name + " needs to pay $" + amountString + ".";

        await addDoc(collection(db, "conversations", convoId, "messages"), {
          text: msg,
          from: props.currentUser,
          type: "Payment",
          createdAt: Timestamp.fromDate(new Date()),
          media: "",
        });
      }

      setBalance("");
    }
  };

  const updateFieldChange = (index, e) => {
    console.log('index: ' + index);
    console.log('property name: '+ e.target.name);

    setPercentage(datas => ({...datas, [index]: e.target.value}));
  }

  return (
    <div className="popup_box">
      <div className="box">
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.handleClose} cursor="pointer">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
      </svg>
        <h2>Group Balance</h2>
        <div className="button_div">
          <form onSubmit={handleSubmit}>
          {users?.map((user, index) => (
            <>
              <h3>{user.data().name}</h3>
              <input
                type="number" 
                min="0" 
                max="100" 
                placeholder="Enter Percentage"
                onChange={(e) => updateFieldChange(index, e)} />
            </>
          ))}
            <hr></hr>
            <input
              type="number"
              placeholder="Enter balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)} />
            <div className="button_div">
              <button className="btn" type="reset" value="reset" onClick={() => setPercentage([])}>Clear Entries</button>  
              <button className="btn" type="submit">Send Requests</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default GroupBalancePopup;