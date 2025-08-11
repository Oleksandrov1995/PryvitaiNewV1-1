import React, { useState, forwardRef } from "react";
import "./HobbiesSection.css";
import { optionsHobbies } from "../../../data/options";

const HobbiesSection = forwardRef(({ onHobbyChange, scrollToNextSection }, ref) => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [customHobby, setCustomHobby] = useState("");
  const maxSelections = 3;

  const handleHobbySelect = (hobby) => {
    setSelectedHobbies(prev => {
      let newSelection;
      
      if (prev.includes(hobby)) {
        // Видаляємо якщо вже вибрано
        newSelection = prev.filter(item => item !== hobby);
      } else {
        // Додаємо якщо не досягли ліміту
        if (prev.length < maxSelections) {
          newSelection = [...prev, hobby];
        } else {
          // Якщо досягли ліміту, показуємо повідомлення
          alert(`Можна вибрати максимум ${maxSelections} варіанти`);
          return prev;
        }
      }
      
      // Очищаємо кастомне поле при виборі готових варіантів
      setCustomHobby("");
      
      if (onHobbyChange) {
        onHobbyChange("hobby", newSelection.join(', '));
      }
      
      // Скролимо тільки якщо вибрано 4 варіанти
      if (newSelection.length === maxSelections && scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
      
      return newSelection;
    });
  };

  const handleCustomHobbyChange = (value) => {
    setCustomHobby(value);
    // Очищаємо готові варіанти при введенні кастомного
    setSelectedHobbies([]);
    
    if (onHobbyChange) {
      onHobbyChange("hobby", value);
    }
    
    // Прибираємо автоскрол при введенні тексту
  };

  const handleCustomHobbyKeyDown = (e) => {
    if (e.key === 'Enter' && customHobby.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

  return (
    <section ref={ref} className="hobbies-section">
      <h2>Атрибути та символи</h2>
      <p className="selection-info">Оберіть до {maxSelections} варіантів ({selectedHobbies.length}/{maxSelections})</p> 
      
      <div className="hobbies-options">
        {optionsHobbies.map((hobby) => (
          <button
            key={hobby}
            type="button"
            onClick={() => handleHobbySelect(hobby)}
            className={`hobby-button ${selectedHobbies.includes(hobby) ? "active" : ""} ${selectedHobbies.length >= maxSelections && !selectedHobbies.includes(hobby) ? "disabled" : ""}`}
            disabled={selectedHobbies.length >= maxSelections && !selectedHobbies.includes(hobby)}
          >
            {hobby}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш варіант (наприклад: колекціонування монет)"
        value={customHobby}
        onChange={(e) => handleCustomHobbyChange(e.target.value)}
        onKeyDown={handleCustomHobbyKeyDown}
        className="custom-hobby-input"
      />
      
   
    </section>
  );
});

export default HobbiesSection;
