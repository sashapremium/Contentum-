import React from 'react';
import Message from './Message';

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <Message key={i} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
}

export default ChatWindow;
