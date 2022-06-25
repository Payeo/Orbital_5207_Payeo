import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import { useCollectionQuery } from "../hooks/useCollectionQuery";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [otherUser, setOtherUser] = useState("");
  const { chatId } = useParams();  

  const currentUser = auth.currentUser.uid;
  let user2;
  
  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("createdAt", "desc"),
      //where("users", "array-contains", currentUser?.uid)
    )
  );

  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [currentUser]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
    //eslint-disable-next-line
  }, []);

  const selectUser = async (user) => {
    setChat(user);

    user2 = user.uid;
    setOtherUser(user2);
    const id = currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== currentUser) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    user2 = chat.uid;

    const id = currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;

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

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: currentUser,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: currentUser,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
    setImg("");
  };

    return (
        <div className="home_container">
          <div className="users_container">
            <div className="users">
              {users.map((user) => (
                <User
                  key={user.uid}
                  user={user}
                  selectUser={selectUser}
                  currentUser={currentUser}
                  chat={chat}
                />
              ))}
          </div>
        </div>
          <div className="messages_container">
            <div className="messages_user">
                <h3>{chat.name}</h3>
            </div>
            <div className="messages">
                {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} currentUser={currentUser} />
                    ))
                : null}
            </div>
            <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
                currentUser={currentUser}
                user2={otherUser}
            />
          </div>
        </div>
      );
}

export default Chat;