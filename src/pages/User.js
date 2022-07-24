import React, { useState, useEffect } from "react";
import Img from "../components/media/default.png";
import { db, auth } from "../firebase";
import { getDoc, doc, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import SideBar from "../components/SideBar/SideBar";
import { useParams } from "react-router-dom";

const User = () => {
  const { userId } = useParams();
  const currentUser = auth.currentUser.uid;
  const [ user, setUser ] = useState();  
  const [ convo, setConvo ] = useState(null);
  const [ credit, setCredit ] = useState(0);
  const [ debit, setDebit ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "users", userId)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  });

  useEffect(() => {
    async function fetchConvo() {
      try {
        setIsLoading(true);
        const conversationRef = collection(db, "conversations");
        const q = query(conversationRef, where("users", "array-contains", currentUser));

        const querySnapshot = await getDocs(q);
        let allDocs = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().users.length === 2 && doc.data().users.includes(userId)) {
            allDocs.push(doc.id)
          }
        })

        setConvo(allDocs[0]);

        if (convo) {
          const balanceRef = collection(db, "conversations", convo, "balance");
          const q = query(balanceRef);
          
          onSnapshot(q, (balanceSnapshot) => {
            balanceSnapshot.forEach((bal) => {
              if (bal.data().from === currentUser) {
                setCredit(bal.data().amount);
              } else {
                setDebit(bal.data().amount);
              }
            })
          });
        }

      } catch (err) {
        console.log(err);
      }
    }
    fetchConvo();
    setIsLoading(false);
    }, [currentUser, convo, userId]);

  return (
    <>
      <div className="home_container">
        <div className="users_container">
            <SideBar></SideBar>
        </div>
        <div className="user_profile_container">
          <div className="profile_container">
            <div className="img_container">
              <img src={user?.avatar || Img} alt="avatar" />
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
                {isLoading ? <p>Loading ...</p> : <p className="owed">${credit}</p>}
              </div>
              <div className="credit">
                <h3>Total amount you owe</h3>
                {isLoading ? <p>Loading ...</p> : <p className="you_owe">${debit}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default User;
