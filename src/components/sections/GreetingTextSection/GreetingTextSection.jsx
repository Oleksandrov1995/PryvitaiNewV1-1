import React, { useState, forwardRef } from "react";
import "./GreetingTextSection.css";
import { greetingTextPrompts } from "../../../prompts/openai/greetingTextPrompts";
import { API_URLS } from "../../../config/api";

const GreetingTextSection = forwardRef(({ onTextChange, scrollToNextSection, formData }, ref) => {
  const [greetingText, setGreetingText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGreetings, setGeneratedGreetings] = useState([]);
  const maxLength = 500;

  const handleTextChange = (value) => {
    if (value.length <= maxLength) {
      setGreetingText(value);
      
      if (onTextChange) {
        onTextChange("greetingText", value);
      }

      // Автоматичний скрол після введення достатньої кількості тексту
      if (value.length >= 20 && scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 1000);
      }
    }
  };

  const handleExampleClick = (example) => {
    handleTextChange(example);
  };

  const generateGreetingIdeas = async () => {
    setIsGenerating(true);
    try {
      console.log('FormData для генерації:', formData);
      const prompt = greetingTextPrompts(formData);
      console.log('Згенерований промпт:', prompt);
      
      const response = await fetch(API_URLS.GENERATE_GREETING, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Помилка при генерації привітань');
      }

      const data = await response.json();
      setGeneratedGreetings(data.greetings || []);
    } catch (error) {
      console.error('Помилка генерації:', error);
      alert('Виникла помилка при генерації привітань. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterCountClass = () => {
    const remaining = maxLength - greetingText.length;
    if (remaining < 50) return 'error';
    if (remaining < 100) return 'warning';
    return '';
  };

  return (
    <section ref={ref} className="greeting-text-section">
      <h2>Текст привітання</h2>
      <p className="description">
        Напишіть особисте привітання або побажання. Це буде основний текст вашої картки.
      </p>

      <div className="greeting-text-container">
        <textarea
          value={greetingText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Введіть ваш текст привітання тут... Наприклад: 'Щиро вітаю з днем народження! Бажаю здоров'я, щастя та успіхів!'"
          className="greeting-textarea"
          maxLength={maxLength}
        />
        
        <div className="character-counter">
          <span>Мінімум 20 символів для продовження</span>
          <span className={`character-count ${getCharacterCountClass()}`}>
            {greetingText.length}/{maxLength}
          </span>
        </div>

        <button 
          onClick={generateGreetingIdeas}
          disabled={isGenerating}
          className="generate-button"
        >
          {isGenerating ? 'Генерую...' : 'Згенерувати ідеї привітання'}
        </button>

        {generatedGreetings.length > 0 && (
          <div className="generated-greetings">
            <h4>💡 Згенеровані ідеї привітань:</h4>
            <div className="greeting-options">
              {generatedGreetings.map((greeting, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(greeting)}
                  className="greeting-option"
                >
                  {greeting}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="greeting-tips">
          <h4>💡 Поради для написання привітання:</h4>
          <ul>
            <li>Використовуйте особисті звернення та імена</li>
            <li>Додайте щирі побажання та емоції</li>
            <li>Згадайте спільні спогади або особливі моменти</li>
            <li>Пишіть від серця - це найважливіше!</li>
            <li>Перевірте текст на помилки перед завершенням</li>
          </ul>
        </div>
      </div>
    </section>
  );
});

export default GreetingTextSection;
