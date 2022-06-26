import {
    collection,
    limitToLast,
    onSnapshot,
    orderBy,
    query,
  } from "firebase/firestore";
  import { useEffect, useState } from "react";
  import dayjs from "dayjs";
  
  import { db } from "../firebase";
  
  let cache = {};

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formatter = dayjs(date);
    const now = new Date();
  
    if (dayjs().isSame(formatter, "date")) return formatter.format("h:mm A");
  
    if (dayjs().isSame(formatter, "week")) return formatter.format("ddd h:mm A");
  
    if (now.getFullYear() === date.getFullYear())
      return formatter.format("MMM DD h:mm A");
  
    return formatter.format("DD MMM YYYY h:mm A");
  };
  
  export const useLastMessage = (conversationId) => {
    const [data, setData] = useState(cache[conversationId] || null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "conversations", conversationId, "messages"),
          orderBy("createdAt"),
          limitToLast(1)
        ),
        (snapshot) => {
          if (snapshot.empty) {
            setData({
              lastMessageId: null,
              message: "No message recently",
            });
            setLoading(false);
            setError(false);
            return;
          }
          let response = (snapshot.docs[0].data().text);
  
          const seconds = snapshot.docs[0]?.data()?.createdAt?.seconds;
          const formattedDate = formatDate(seconds ? seconds * 1000 : Date.now());
          
          if (response === undefined) {
            setData({lastMessageId: null, message: "No message recently",});
          } else {
            response =
            response?.length > 30 - formattedDate.length
              ? `${response.slice(0, 30 - formattedDate.length)}...`
              : response;
          }
  
          const result = `${response} • ${formattedDate}`;
          setData({
            lastMessageId: snapshot.docs?.[0]?.id,
            message: result,
          });
          cache[conversationId] = {
            lastMessageId: snapshot.docs?.[0]?.id,
            message: result,
          };
          setLoading(false);
          setError(false);
        },
        (err) => {
          console.log(err);
          setData(null);
          setLoading(false);
          setError(true);
        }
      );
  
      return () => {
        unsubscribe();
      };
    }, [conversationId]);
  
    return { data, loading, error };
  };