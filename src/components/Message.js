import React from 'react';

function Message({ from, text }) {
  return (
    <div className={`message ${from}`}>
      <div className="bubble">{text}</div>
    </div>
  );
}

export default Message;
