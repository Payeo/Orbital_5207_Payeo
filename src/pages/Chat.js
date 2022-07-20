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
              <button className="messages_user_back" onClick={history.goBack}>&laquo;</button>
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
              currentUser={currentUser}
          />
        </div>
      </div>
      );
}

export default Chat;