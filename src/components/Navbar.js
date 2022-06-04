import React, { useContext, createContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";

export const ThemeContext = createContext(null);

const Navbar = (props) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace("/login");
  };
  return (
  <nav>
    <h3>
      <Link to="/">Payeo</Link>
    </h3>
    <div>
      <Switch onChange={props.toggleTheme} checked={props.theme === "dark"} />
    </div>
    <div className="logout_container">
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button className="btn" onClick={handleSignout}>
            Logout
          </button>
        </>
        ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  </nav>
  );
};

export default Navbar;
