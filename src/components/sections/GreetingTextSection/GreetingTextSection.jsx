import React, { useState, forwardRef, useRef } from "react";
import "./GreetingTextSection.css";
import { greetingTextPrompts } from "../../../prompts/openai/greetingTextPrompts";
import { API_URLS } from "../../../config/api";

const GreetingTextSection = forwardRef(({ onTextChange, scrollToNextSection, formData }, ref) => {
  const [greetingText, setGreetingText] = useState("");
  const [previewText, setPreviewText] = useState(""); // Проміжний стейт для попереднього перегляду
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGreetings, setGeneratedGreetings] = useState([]);
  const textareaRef = useRef(null);
  const generatedGreetingsRef = useRef(null);
  const maxLength = 500;

    const sectionRef = useRef(null); // окремий ref на DOM
  

  const getCurrentText = () => previewText || greetingText || '';


  // Експонуємо функцію через ref
  React.useImperativeHandle(ref, () => ({
    getCurrentText
  }));

  const handleTextChange = (value) => {
    if (value.length <= maxLength) {
      setPreviewText(value); // Оновлюємо тільки preview
      
      // Передаємо текст в formData
      if (onTextChange) {
        onTextChange("greetingText", value);
      }
      
      // Прибираємо автоматичний скрол звідси
    }
  };

  const handleExampleClick = (example) => {
    handleTextChange(example);
    
    // Передаємо вибрану ідею в formData
    if (onTextChange) {
      onTextChange("greetingText", example);
    }
    
    // Скролимо до textarea після вибору варіанту
    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      
      // Фокусуємося на textarea після скролу
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 500);
    }
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
      
      // Скролимо до згенерованих привітань після їх отримання
      setTimeout(() => {
        if (generatedGreetingsRef.current && data.greetings && data.greetings.length > 0) {
          generatedGreetingsRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300); // Невелика затримка щоб DOM встиг оновитися
      
    } catch (error) {
      console.error('Помилка генерації:', error);
      alert('Виникла помилка при генерації привітань. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterCountClass = () => {
    const remaining = maxLength - previewText.length;
    if (remaining < 50) return 'error';
    if (remaining < 100) return 'warning';
    return '';
  };

   React.useImperativeHandle(ref, () => ({
    scrollIntoView: (options) => sectionRef.current?.scrollIntoView(options),
    getCurrentText
  }));

  return (
    <section ref={sectionRef} className="greeting-text-section">
      <h2>Текст привітання</h2>
      {/* <p className="description">
        Напишіть особисте привітання або побажання. Це буде основний текст вашої картки.
      </p> */}

        <button 
          onClick={generateGreetingIdeas}
          disabled={isGenerating}
          className="generate-button"
          style={{ display: generatedGreetings.length > 0 ? 'none' : 'block' }}
        >
          {isGenerating ? 'Генерую...' : 'Згенерувати ідеї тексту привітання'}
        </button>
        {/* <span>Генерація займе орієнтовно 30 секунд</span> - треба додати стилі */}

      <div className="greeting-text-container">
        <textarea
          ref={textareaRef}
          value={previewText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Або Ваш варіант - наприклад: 'Бажаю здоров'я, щастя та квітучого процвітання!'"
          className="greeting-textarea"
          maxLength={maxLength}
        />
        
        <div className="character-counter">
          <span>Мінімум 20 символів для продовження</span>
          <span className={`character-count ${getCharacterCountClass()}`}>
            {previewText.length}/{maxLength}
          </span>
         
        </div>



        {generatedGreetings.length > 0 && (
          <div className="confirm-actions">
            <button 
              onClick={() => {
                // Підтверджуємо текст - переносимо з preview в основний стейт
                setGreetingText(previewText);
                
                if (scrollToNextSection) {
                  scrollToNextSection();
                }
              }}
              className="confirm-button"
              disabled={!previewText || previewText.length < 20}
            >
              ✅ Підтвердити ідею
            </button>
            
            <button 
              onClick={generateGreetingIdeas}
              disabled={isGenerating}
              className="regenerate-button"
            >
              🔄
            </button>
          </div>
        )}

        {generatedGreetings.length > 0 && (
          <div ref={generatedGreetingsRef} className="generated-greetings">
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
                  <p>Перевірте згенерований текст на помилки та відредагуйте за необхідності</p>
        </div>
      </div>
    </section>
  );
});

export default GreetingTextSection;
