import React, { useState, forwardRef } from "react";
import "./CardStyleSection.css";
import { cardStyleOptions } from "../../../data/options";

const CardStyleSection = forwardRef(({ onStyleChange, scrollToNextSection }, ref) => {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [customStyle, setCustomStyle] = useState("");

  const handleOptionSelect = (style) => {
    setSelectedStyle(style);
    setCustomStyle("");
    
    // Викликаємо callback функцію для передачі даних батьківському компоненту
    if (onStyleChange) {
      onStyleChange("cardStyle", style);
    }
    
    // Скролимо до наступної секції
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomStyleChange = (value) => {
    setCustomStyle(value);
    setSelectedStyle("");
    
    // Викликаємо callback функцію для передачі даних батьківському компоненту
    if (onStyleChange) {
      onStyleChange("cardStyle", value);
    }
  };

  const handleCustomStyleKeyDown = (e) => {
    if (e.key === 'Enter' && customStyle.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };
  return (
    <section ref={ref} className="card-style-section">
      <h2>Стиль</h2>
      <div className="card-style-options">
        {cardStyleOptions.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => handleOptionSelect(style)}
            className={`card-style-button ${selectedStyle === style && customStyle === "" ? "active" : ""}`}
          >
            {style}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ваш креативний варіант - наприклад: в стилі мультика Енеїда"
        value={customStyle}
        onChange={(e) => handleCustomStyleChange(e.target.value)}
        onKeyDown={handleCustomStyleKeyDown}
        className="custom-style-input"
      />
    </section>
  );
});

export default CardStyleSection;

