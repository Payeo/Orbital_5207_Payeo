import React, { useState } from "react";
import Attachment from "./svg/Attachment";
import BalancePopup from "./BalancePopUp";

const MessageForm = ({ handleSubmit, text, setText, setImg, user1, user2 }) => {

  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="message_form_div">
      <form className="message_form" onSubmit={handleSubmit}>
        <label htmlFor="img">
          <Attachment />
        </label>
        <input
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
          id="img"
          accept="image/*"
          style={{ display: "none" }} />
        <div>
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <button className="btn">Send</button>
        </div>
      </form>
      <input
          className="btn"
          type="button"
          value="Balance"
          onClick={togglePopup}
          />
      {isOpen && <BalancePopup
        user1={user1}
        user2={user2}
        handleClose={togglePopup}
      />}
    </div>
  );
};

export default MessageForm;
