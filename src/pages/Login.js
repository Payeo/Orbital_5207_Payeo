import React, { useState } from "react";
import LoginPopUp from "../components/Pop-ups/LoginPopup";
import RegisterPopup from "../components/Pop-ups/RegisterPopup";

const Login = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  }

  const toggleRegisterPopup = () => {
    setIsRegisterOpen(!isRegisterOpen);
  }

  return (
    <div className="login_div">
      <img src={require('../components/media/payeologo.png')} alt="" className="login_pic"></img>
      <div className="login_buttons_div">
        <input
            className="btn"
            type="button"
            value="Login"
            onClick={toggleLoginPopup}
            />
          <input
          className="btn"
          type="button"
          value="Register"
          onClick={toggleRegisterPopup}
          />
        {isLoginOpen && <LoginPopUp
          handleClose={toggleLoginPopup}
        />}
        {isRegisterOpen && <RegisterPopup
          handleClose={toggleRegisterPopup}
        />}
      </div>
    </div>
  );
};

export default Login;
