import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase";
import { updateDoc, doc, Timestamp, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

 
const LoginPopUp = props => {
    const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  const handleGoogle = async (provider) => {
    setData({ ...data, error: null, loading: true });
    signInWithPopup(auth, provider)
      .then(async (res) => {
        console.log(res.user);
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
        setData({
          email: res.user.email,
          password: "",
          error: null,
          loading: false,
        })
      history.replace("/");
      }
    ).catch((err) => {
      setData({ ...data, error: err.message, loading: false });
    })
  };
  return (
    <div className="login_popup_box">
      <div className="login_box">
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.handleClose} cursor="pointer">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fill-opacity="0.8"/>
      </svg>
      <h3>Log In</h3>
      <form className="login_form" onSubmit={handleSubmit}>
          <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
          />
          </div>
          <div className="input_container">
              <label htmlFor="password">Password</label>
              <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
              />
          </div>
              {error ? <p className="error">{error}</p> : null}
              <div className="btn_container">
                  <button className="btn" disabled={loading}>
                      {loading ? "Logging in ..." : "Login"}
                  </button>
              </div>
          </form>
          <div className="login_border"></div>
          <h3>Log in using Google</h3>
          <div>
              <button className="btn" onClick={() => handleGoogle(new GoogleAuthProvider())}>
              {loading ? "Logging in ..." : "Sign In with Google"}
              </button>
          </div>
      </div>
    </div>
  );
};
 
export default LoginPopUp;