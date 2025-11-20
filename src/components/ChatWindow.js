import React from 'react';
import Message from './Message';

function ChatWindow({ messages }) {
  return (
    <>
      {messages.map((msg, i) => (
        <Message
          key={i}
          from={msg.messageType}
          text={msg.content}
          image={msg.imageUrl} // Картинка если есть
        />
      ))}
    </>
  );
}

export default ChatWindow;
