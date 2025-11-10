import React, { useState } from 'react';
import '../App';
import { FaCommentAlt, FaPlus, FaUserCircle, FaBars } from 'react-icons/fa';

function Sidebar({ chats, onSelectChat, onNewChat, onDeleteChat, currentChat, user }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/*Верхняя панель*/}
      <div className="sidebar-header">
        {collapsed ? (
          <button className="menu-btn" onClick={() => setCollapsed(false)} title="Развернуть">
            <FaBars />
          </button>
        ) : (
          <div className="sidebar-title" onClick={() => setCollapsed(true)} title="Свернуть панель">
            История диалогов
          </div>
        )}
      </div>

      {!collapsed && (
        <ul className="chat-list">
          {chats.length === 0 && <p style={{ padding: '10px', opacity: 0.6 }}>Нет чатов</p>}

          {chats.map((chat) => (
            <li
              key={chat.title}
              className={`chat-item ${currentChat?.title === chat.title ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}>
              <span className="chat-title">{chat.title}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.title);
                }}
                title="Удалить">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/*Новый чат*/}
      {!collapsed ? (
        <button className="new-chat-btn" onClick={onNewChat}>
          <FaPlus style={{ marginRight: '6px' }} /> Новый чат
        </button>
      ) : (
        <button
          className="icon-btn small"
          onClick={onNewChat}
          title="Новый чат"
          style={{ marginTop: 'auto' }}>
          <FaPlus />
        </button>
      )}

      {/*Блок пользователя*/}
      <div className="sidebar-user">
        <FaUserCircle size={34} style={{ marginRight: collapsed ? 0 : '10px' }} />
        {!collapsed && <span className="user-name">{user?.name || 'User'}</span>}
      </div>
    </div>
  );
}

export default Sidebar;
