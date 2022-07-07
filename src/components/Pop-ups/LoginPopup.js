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
      <span className="close_icon" onClick={props.handleClose}>x</span>
      <section>
        <h3>Log into your Account</h3>
        <form className="form" onSubmit={handleSubmit}>
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
            <div className="login_div">
                <button className="btn" onClick={() => handleGoogle(new GoogleAuthProvider())}>
                {loading ? "Logging in ..." : "Sign In with Google"}
                </button>
            </div>
        </section>
      </div>
    </div>
  );
};
 
export default LoginPopUp;