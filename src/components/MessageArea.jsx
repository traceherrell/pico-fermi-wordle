// src/components/MessageArea.js
import React from "react";
import "./MessageArea.css";

function MessageArea({ message, type = "info" }) {
  // type: 'info', 'error', 'success'
  if (!message) return null;

  return <div className={`message-area ${type}`}>{message}</div>;
}

export default MessageArea;
