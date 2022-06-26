import { useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useHistory } from "react-router-dom";

const CreateConversation = ({ setIsOpened }) => {
  const currentUser = auth.currentUser.uid;
  const { data, error, loading } = useCollectionQuery(
    "all-users",
    collection(db, "users")
  );
  const [isCreating, setIsCreating] = useState(false);
  const [selected, setSelected] = useState([]);
  const navigate = useHistory();

  const handleToggle = (uid) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((item) => item !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };

  const handleCreateConversation = async () => {
    setIsCreating(true);
    const sorted = [...selected, currentUser].sort();

    const q = query(
      collection(db, "conversations"),
      where("users", "==", sorted)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const created = await addDoc(collection(db, "conversations"), {
        users: sorted,
        group:
          sorted.length > 2
            ? {
                admins: [currentUser],
                groupName: null,
                groupImage: null,
              }
            : {},
        updatedAt: serverTimestamp(),
        seen: {},
      });

      setIsCreating(false);

      setIsOpened(false);

      navigate.push(`/${created.id}`);
    } else {
      setIsOpened(false);

      navigate.push(`/${querySnapshot.docs[0].id}`);

      setIsCreating(false);
    }
  };

  return (
    <div
      onClick={() => setIsOpened(false)}
      className="create_convo_btn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="stop_propagation"
      >
        <div className="create_convo_div">
          <div className="create_convo_div_inner"></div>
          <div className="create_convo">
            <h1 className="create_convo_title">
              New conversation
            </h1>
          </div>
          <div className="create_convo_close">
            <button
              onClick={() => setIsOpened(false)}
              className="create_convo_close_btn"
            >
              <p className="">x</p>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="create_convo_loading">
            <p>Loading</p>
          </div>
        ) : error ? (
          <div className="create_convo_loading">
            <p className="text-center">Something went wrong</p>
          </div>
        ) : (
          <>
            {isCreating && (
              <div className="creating_convo">
                <p>Loading</p>
              </div>
            )}
            <div className="create_convo_users">
              {data?.docs
                .filter((doc) => doc.data().uid !== currentUser?.uid)
                .map((doc) => (
                  <div
                    key={doc.data().uid}
                    onClick={() => handleToggle(doc.data().uid)}
                    className="hover:bg-dark-lighten flex cursor-pointer items-center gap-2 px-5 py-2 transition"
                  >
                    <input
                      className="flex-shrink-0 cursor-pointer"
                      type="checkbox"
                      checked={selected.includes(doc.data().uid)}
                      readOnly
                    />
                    <img
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt=""
                    />
                    <p>{doc.data().displayName}</p>
                  </div>
                ))}
            </div>
            <div className="border-dark-lighten flex justify-end border-t p-3">
              <button
                disabled={selected.length === 0}
                onClick={handleCreateConversation}
                className="bg-dark-lighten rounded-lg py-2 px-3 transition duration-300 hover:brightness-125 disabled:!brightness-[80%]"
              >
                Start conversation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateConversation;