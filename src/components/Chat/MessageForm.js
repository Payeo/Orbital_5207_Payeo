import React, { useState } from "react";
import Attachment from "../svg/Attachment";
import BalancePopup from "../Pop-ups/BalancePopUp";
import GroupBalancePopup from "../Pop-ups/GroupBalancePopUp";

const MessageForm = ({ handleSubmit, text, setText, setImg, users, currentUser }) => {
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
          <span className="message_form_span"> 
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)} />
            </span>
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
      {isOpen && users?.length < 2 
      ? <BalancePopup
        users={users}
        currentUser={currentUser}
        handleClose={togglePopup}
      /> 
      : isOpen && <GroupBalancePopup // For Group Conversations
      users={users}
      currentUser={currentUser}
      handleClose={togglePopup}
      /> }
    </div>
  );
};

export default MessageForm;
