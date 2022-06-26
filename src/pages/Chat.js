import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  addDoc,
  Timestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import SideBar from "../components/Chat/SideBar";

const Chat = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const { convoId } = useParams();  

  const currentUser = auth.currentUser.uid;  

  useEffect(() => {
  const msgsRef = collection(db, "conversations", convoId, "messages");
  const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  }, [convoId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = convoId;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "conversations", id, "messages"), {
      text,
      from: currentUser,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    setText("");
    setImg("");
  };

    return (
        <div className="home_container">
          <SideBar></SideBar>
          <div className="messages_container">
            <div className="messages_user">
                <h3>{"sdsd"}</h3>
            </div>
            <div className="messages">
                {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={currentUser} />
                    ))
                : null}
            </div>
            <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
                currentUser={currentUser}
            />
          </div>
        </div>
      );
}

export default Chat;