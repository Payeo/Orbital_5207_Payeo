import React, { useContext, createContext, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import { BeatLoader } from "react-spinners";

export const ThemeContext = createContext(null);

const Navbar = (props) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    setLogoutLoading(true);
    await signOut(auth);
    history.replace("/login");
  };
  return (
  <nav>
    <h3>
      <Link to="/" className="logo_title">
        <img src={require('./media/logo.png')} alt="" className="logo"></img>
        Payeo
      </Link>
    </h3>
    <div className="logout_container">
      <div>
        <Switch 
          className="switch"
          onChange={props.toggleTheme} 
          checked={props.theme === "dark"}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={15}
          width={32} 
        />
      </div>
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button className="btn" onClick={handleSignout}>
            {logoutLoading ? <BeatLoader size={8} /> : "Logout"}
          </button>
        </>
        ) : (
        <>
        </>
      )}
    </div>
  </nav>
  );
};

export default Navbar;
