import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  addDoc,
  Timestamp,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import MessageForm from "../components/Chat/MessageForm";
import Message from "../components/Chat/Message";
import { useParams, useHistory, Link } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import { useUsersInfo } from "../hooks/useUsersInfo";
import { useDocumentQuery } from "../hooks/useDocumentQuery";

const Chat = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const { convoId } = useParams();  
  const history = useHistory();

  const { data } = useDocumentQuery(
    `conversation-${convoId}`,
    doc(db, "conversations", convoId)
  );

  const conversation = data?.data();
  const currentUser = auth.currentUser.uid;  
  const { data: users } = useUsersInfo(conversation?.users);
  const filtered = users?.filter((user) => user.id !== currentUser);

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
        <div className="users_container">
          <SideBar></SideBar>
        </div>
        <div className="messages_container">
          <div className="messages_user">
            <div className="messages_user_header">
              <div className="messages_user_back">
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={history.goBack} cursor="pointer">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
                </svg>
              </div>
                <p>
                  {users?.length === 2 
                  ? <Link to={`/users/${filtered[0]?.data().uid}`} className="messages_user_name"> {filtered[0]?.data().name} </Link>
                  : users?.length > 2 && conversation?.group?.groupName
                    ? conversation.group.groupName
                    : filtered
                        ?.map((user) => user?.data().name)
                        .slice(0, 3)
                        .join(", ")}
                </p>
            </div>
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
              users={filtered}
              currentUser={currentUser}
          />
        </div>
      </div>
      );
}

export default Chat;