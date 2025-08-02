import React, { useState, forwardRef } from "react";
import "./GenderAgeSection.css";

const GenderAgeSection = forwardRef(({ onGenderChange, onAgeChange, scrollToNextSection }, ref) => {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  const genderOptions = [
    { value: "male", label: "Чоловік", icon: "👨" },
    { value: "female", label: "Жінка", icon: "👩" }
  ];

   const handleGenderSelect = (gender) => {
    setSelectedGender(gender.value);
    
    if (onGenderChange) {
      onGenderChange("gender", gender.value);
    }
    
    // Автоматично скролити тільки якщо обидва поля заповнені
    if (selectedAge && scrollToNextSection) {
      setTimeout(() => scrollToNextSection(), 300);
    }
  };


  const handleAgeInputChange = (value) => {
    const age = parseInt(value);
    if (!isNaN(age) && age > 0 && age <= 120) {
      setSelectedAge(age);
      
      if (onAgeChange) {
        onAgeChange("age", age);
      }
      
      // Автоматично скролити тільки якщо обидва поля заповнені
      if (selectedGender && scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    } else if (value === "") {
      setSelectedAge("");
      if (onAgeChange) {
        onAgeChange("age", "");
      }
    }
  };

  return (
    <section ref={ref} className="gender-age-section">
      <h2>Основна інформація</h2>
      
      <div className="gender-age-container">
        <div className="gender-group">
          <h3>Стать</h3>
          <div className="gender-options">
            {genderOptions.map((gender) => (
              <button
                key={gender.value}
                type="button"
                onClick={() => handleGenderSelect(gender)}
                className={`gender-button ${selectedGender === gender.value ? "active" : ""}`}
              >
                <span className="gender-icon">{gender.icon}</span>
                {gender.label}
              </button>
            ))}
          </div>
        </div>

        <div className="age-group">
          <h3>Вік</h3>
          <div className="age-input-container">
            <input
              type="number"
              min="1"
              max="120"
              placeholder="Вік"
              value={selectedAge}
              onChange={(e) => handleAgeInputChange(e.target.value)}
              className="age-input"
            />
            <span className="age-label"></span>
          </div>

        
        </div>
      </div>
    </section>
  );
});

export default GenderAgeSection;
