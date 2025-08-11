import React, { useState, forwardRef } from "react";
import "./TraitsSection.css";
import { optionsTraits } from "../../../data/options";

const TraitsSection = forwardRef(({ onTraitChange, scrollToNextSection }, ref) => {
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [customTrait, setCustomTrait] = useState("");
  const maxSelections = 3;

  const handleTraitSelect = (trait) => {
    setSelectedTraits(prev => {
      let newSelection;
      
      if (prev.includes(trait)) {
        // Видаляємо якщо вже вибрано
        newSelection = prev.filter(item => item !== trait);
      } else {
        // Додаємо якщо не досягли ліміту
        if (prev.length < maxSelections) {
          newSelection = [...prev, trait];
        } else {
          // Якщо досягли ліміту, показуємо повідомлення
          alert(`Можна вибрати максимум ${maxSelections} варіанти`);
          return prev;
        }
      }
      
      // Очищаємо кастомне поле при виборі готових варіантів
      setCustomTrait("");
      
      if (onTraitChange) {
        onTraitChange("trait", newSelection.join(', '));
      }
      
      // Скролимо тільки якщо вибрано 4 варіанти
      if (newSelection.length === maxSelections && scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
      
      return newSelection;
    });
  };

  const handleCustomTraitChange = (value) => {
    setCustomTrait(value);
    // Очищаємо готові варіанти при введенні кастомного
    setSelectedTraits([]);
    
    if (onTraitChange) {
      onTraitChange("trait", value);
    }
    
    // Прибираємо автоскрол при введенні тексту
  };

  const handleCustomTraitKeyDown = (e) => {
    if (e.key === 'Enter' && customTrait.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

  return (
    <section ref={ref} className="traits-section">
      <h2>Риси та цінності</h2>
      <p className="selection-info">Оберіть до {maxSelections} варіантів ({selectedTraits.length}/{maxSelections})</p>
      
      <div className="traits-options">
        {optionsTraits.map((trait) => (
          <button
            key={trait}
            type="button"
            onClick={() => handleTraitSelect(trait)}
            className={`trait-button ${selectedTraits.includes(trait) ? "active" : ""} ${selectedTraits.length >= maxSelections && !selectedTraits.includes(trait) ? "disabled" : ""}`}
            disabled={selectedTraits.length >= maxSelections && !selectedTraits.includes(trait)}
          >
            {trait}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш варіант риси (наприклад: креативність)"
        value={customTrait}
        onChange={(e) => handleCustomTraitChange(e.target.value)}
        onKeyDown={handleCustomTraitKeyDown}
        className="custom-trait-input"
      />
      
     
    </section>
  );
});

export default TraitsSection;
