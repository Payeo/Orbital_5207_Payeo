import { onSnapshot } from "firebase/firestore";
  import { useEffect, useState } from "react";
  
  let cache = {};
  
  export const useDocumentQuery = (key, document) => {
    const [data, setData] = useState(
      cache[key] || null
    );
    const [loading, setLoading] = useState(!Boolean(data));
    const [error, setError] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        document,
        (snapshot) => {
          setData(snapshot);
          setLoading(false);
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
      // eslint-disable-next-line
    }, [key]);
  
    return { loading, error, data };
  };