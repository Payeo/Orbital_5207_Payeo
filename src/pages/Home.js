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
import SelectConversation from "../components/Chat/SelectConvo";
import useCollectionQuery from "../hooks/useCollectionQuery";
import CreateConversation from "../components/Chat/CreateConvo";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [otherUser, setOtherUser] = useState("");
  const [createConversationOpened, setCreateConversationOpened] = useState(false);
  const currentUser = auth.currentUser.uid;
  
  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser)
    )
  );

  console.log(data.docs);

  return (
    
    <div className="home_container">
      <button
              onClick={() => setCreateConversationOpened(true)}
              className="bg-dark-lighten h-8 w-8 rounded-full"
            ></button>
      <div className="users_container">
        <div className="users">
          {data?.docs.map((item) => (
            <SelectConversation 
              key={item.id}
              conversation={item.data()}
              conversationId={item.id}
            />
          ))}
        </div>
      </div>
      {createConversationOpened && (
        <CreateConversation setIsOpened={setCreateConversationOpened} />
      )}
      <div className="messages_container">

          <h3 className="no_conv">Select a user to start conversation</h3>
      </div>
    </div>
  );
};

export default Home;
