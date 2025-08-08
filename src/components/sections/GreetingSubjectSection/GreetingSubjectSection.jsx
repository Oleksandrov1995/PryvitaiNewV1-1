import React, { useState, forwardRef } from "react";
import "./GreetingSubjectSection.css";
import { optionsGreetingSubject } from "../../../data/options";

const GreetingSubjectSection = forwardRef(({ onSubjectChange, scrollToNextSection }, ref) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCustomSubject("");
    
    if (onSubjectChange) {
      onSubjectChange("greetingSubject", subject);
    }
    
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomSubjectChange = (value) => {
    setCustomSubject(value);
    setSelectedSubject("");
    
    if (onSubjectChange) {
      onSubjectChange("greetingSubject", value);
    }
  };

  const handleCustomSubjectKeyDown = (e) => {
    if (e.key === 'Enter' && customSubject.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

  return (
    <section ref={ref} className="greeting-subject-section">
      <h2>З чим вітаємо?</h2>
      
      <div className="greeting-subject-options">
        {optionsGreetingSubject.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => handleSubjectSelect(subject)}
            className={`greeting-subject-button ${selectedSubject === subject && customSubject === "" ? "active" : ""}`}
          >
            {subject}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ваш варіант (наприклад: завершення проекту)"
        value={customSubject}
        onChange={(e) => handleCustomSubjectChange(e.target.value)}
        onKeyDown={handleCustomSubjectKeyDown}
        className="custom-greeting-subject-input"
      />
    </section>
  );
});

export default GreetingSubjectSection;
