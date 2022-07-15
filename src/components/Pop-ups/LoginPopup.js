import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase";
import { updateDoc, doc, Timestamp, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { BeatLoader } from "react-spinners";
 
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
        <path fillRule="evenodd" clipRule="evenodd" d="M1.91421 4.35355L4.56066 7L3.85355 7.70711L0.353553 4.20711L0 3.85355L0.353553 3.5L3.85355 0L4.56066 0.707107L1.91421 3.35355L5.70711 3.35355C9.28325 3.35355 12.2071 6.27741 12.2071 9.85355L12.2071 11.3536H11.2071L11.2071 9.85355C11.2071 6.8297 8.73096 4.35355 5.70711 4.35355H1.91421Z" fill="currentColor" fillOpacity="0.8"/>
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
                      {loading ? <BeatLoader size={8} /> : "Login"}
                  </button>
              </div>
          </form>
          <div className="login_border"></div>
          <h3>Log in using Google</h3>
          <div>
              <button className="btn" onClick={() => handleGoogle(new GoogleAuthProvider())}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              <div className="google">
                {loading ? <BeatLoader size={8} />  : "Sign In with Google"}
              </div>
              </button>
          </div>
      </div>
    </div>
  );
};
 
export default LoginPopUp;