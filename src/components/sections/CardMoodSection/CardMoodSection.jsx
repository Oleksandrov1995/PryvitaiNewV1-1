import React, { useState, forwardRef } from "react";
import "./CardMoodSection.css";
import { cardMoodOptions } from "../../../data/options";

const CardMoodSection = forwardRef(({ onMoodChange, scrollToNextSection }, ref) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [customMood, setCustomMood] = useState("");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCustomMood("");
    
    if (onMoodChange) {
      onMoodChange("cardMood", mood);
    }
    
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomMoodChange = (value) => {
    setCustomMood(value);
    setSelectedMood("");
    
    if (onMoodChange) {
      onMoodChange("cardMood", value);
    }
  };

  const handleCustomMoodKeyDown = (e) => {
    if (e.key === 'Enter' && customMood.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

  return (
    <section ref={ref} className="card-mood-section">
      <h2>Настрій</h2>
      
      <div className="card-mood-options">
        {cardMoodOptions.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => handleMoodSelect(mood)}
            className={`card-mood-button ${selectedMood === mood && customMood === "" ? "active" : ""}`}
          >
            {mood}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш креативний варіант - наприклад: настрій дружнього підколу"
        value={customMood}
        onChange={(e) => handleCustomMoodChange(e.target.value)}
        onKeyDown={handleCustomMoodKeyDown}
        className="custom-mood-input"
      />
    </section>
  );
});

export default CardMoodSection;
