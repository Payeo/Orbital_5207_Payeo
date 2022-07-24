import React, { useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import SelectConversation from "./SelectConvo";
import useCollectionQuery from "../../hooks/useCollectionQuery";
import CreateConversation from "./CreateConvo";

const Sidebar = () => {
  const [createConversationOpened, setCreateConversationOpened] = useState(false);
  const currentUser = auth.currentUser.uid;
  
  const { data } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser)
    )
  );

  return (
  <>
    {createConversationOpened && (
        <CreateConversation setIsOpened={setCreateConversationOpened} />
    )}
    <div className="users">
      {data?.docs?.map((item) => (
        <SelectConversation
          key={item.id}
          conversation={item.data()}
          conversationId={item.id} />
      ))}
    </div>
    <div className="floating_btn_container" onClick={() => setCreateConversationOpened(true)}>
      <div className="button iconbutton"> <i>+</i> </div>
    </div>
  </>
  )
}

export default Sidebar;