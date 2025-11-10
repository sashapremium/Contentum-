import React, { useRef, useState } from 'react';
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import '../styles/InputBar.css';

function InputBar({ value, onChange, onSend, onImageUpload }) {
  const fileInputRef = useRef(null);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('9:16');
  const [selectedPlatform, setSelectedPlatform] = useState('VK');
  const [openDirection, setOpenDirection] = useState('up');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(file);
  };

  const handleToggleMenu = (e, menuType) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const spaceAbove = buttonRect.top;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const direction = spaceAbove > spaceBelow ? 'up' : 'down';
    setOpenDirection(direction);

    if (menuType === 'format') {
      setShowFormatMenu((prev) => !prev);
      setShowPlatformMenu(false);
    } else if (menuType === 'platform') {
      setShowPlatformMenu((prev) => !prev);
      setShowFormatMenu(false);
    }
  };

  const handleSelectFormat = (format) => {
    setSelectedFormat(format);
    setShowFormatMenu(false);
  };

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatformMenu(false);
  };

  return (
    <div className="input-section">
      {/* === Кнопки выбора === */}
      <div className="input-options">
        <div className="option-btn" onClick={(e) => handleToggleMenu(e, 'format')}>
          Формат: {selectedFormat}
          {showFormatMenu && (
            <div className={`dropdown dropdown-${openDirection}`}>
              {['9:16', '1:1', '16:9'].map((opt) => (
                <div key={opt} className="dropdown-item" onClick={() => handleSelectFormat(opt)}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="option-btn" onClick={(e) => handleToggleMenu(e, 'platform')}>
          Платформа: {selectedPlatform}
          {showPlatformMenu && (
            <div className={`dropdown dropdown-${openDirection}`}>
              {['VK', 'YouTube Shorts', 'Telegram'].map((opt) => (
                <div key={opt} className="dropdown-item" onClick={() => handleSelectPlatform(opt)}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*Поле ввода*/}
      <div className="input-container">
        <div className="input-box">
          <input
            className="chat-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <div className="input-actions">
            <button
              className="icon-btn"
              onClick={() => fileInputRef.current.click()}
              title="Загрузить изображение">
              <FaImage />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="icon-btn" onClick={onSend} title="Отправить">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputBar;
